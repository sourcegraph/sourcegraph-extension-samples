import { combineLatest, from, Subject } from 'rxjs'
import { concatMap, filter, first, map, share, switchMap } from 'rxjs/operators'
import * as sourcegraph from 'sourcegraph'

const repositoryDeleted = (repoName: string): Promise<boolean> => Promise.resolve(true)

const getRepoName = ({ uri }: Pick<sourcegraph.TextDocument, 'uri'>): string => {
    const { hostname, pathname } = new URL(uri)
    return `${hostname}${pathname}`
}

const getDeletedFileDecorations = ({
    text,
}: Pick<sourcegraph.TextDocument, 'text'>): sourcegraph.TextDocumentDecoration[] =>
    text?.split(`\n`).map(
        (_, index): sourcegraph.TextDocumentDecoration => ({
            range: new sourcegraph.Range(new sourcegraph.Position(index, 0), new sourcegraph.Position(index, 0)),
            backgroundColor: 'hsl(0, 50%, 50%)',
        })
    ) ?? []

export function activate(ctx: sourcegraph.ExtensionContext): void {
    const decorationType = sourcegraph.app.createDecorationType()

    /**
     * An Observable that emits the currently active window.
     */
    const activeWindow = from(sourcegraph.app.activeWindowChanges).pipe(
        filter((activeWindow): activeWindow is sourcegraph.Window => activeWindow !== undefined),
        share()
    )

    /**
     * An Observable that emits the currently active editor.
     */
    const activeEditor = activeWindow.pipe(
        switchMap(window => window.activeViewComponentChanges),
        filter((editor): editor is sourcegraph.CodeEditor => editor !== undefined)
    )

    interface Settings {
        ['git.meta.notifications']?: boolean
        ['git.meta.lineDecorations']?: boolean
        ['git.meta.searchQueryTransformer']?: boolean
    }

    const configurationChanges = new Subject<void>()
    ctx.subscriptions.add(
        sourcegraph.configuration.subscribe(() => {
            configurationChanges.next()
        })
    )

    /**
     * An Observable of the extension's persisted settings
     */
    const settings = configurationChanges.pipe(map(() => sourcegraph.configuration.get<Settings>().value))

    // Reset decorations if git.meta.lineDecorations is falsey
    ctx.subscriptions.add(
        combineLatest([settings, activeWindow]).subscribe(([settings, window]) => {
            if (!settings['git.meta.lineDecorations']) {
                for (const editor of window.visibleViewComponents) {
                    editor.setDecorations(decorationType, [])
                }
            }
        })
    )

    // Show notification and decorations on newly added editors
    // if the repository has been deleted.
    ctx.subscriptions.add(
        combineLatest([settings, activeWindow, activeEditor])
            .pipe(
                concatMap(([settings, window, editor]) => {
                    const repoName = getRepoName(editor.document)
                    return from(repositoryDeleted(repoName)).pipe(
                        map(deleted => ({ settings, window, editor, repoName, deleted }))
                    )
                })
            )
            .subscribe(({ settings, window, editor, repoName, deleted }) => {
                if (!deleted) {
                    return
                }
                if (settings['git.meta.lineDecorations']) {
                    editor.setDecorations(decorationType, getDeletedFileDecorations(editor.document))
                }
                if (settings['git.meta.notifications']) {
                    window.showNotification(
                        `git-meta: repo ${repoName} has been deleted`,
                        sourcegraph.NotificationType.Warning
                    )
                }
            })
    )

    // Register search query transforfmer to exclude deleted repostiories
    ctx.subscriptions.add(
        settings
            .pipe(
                filter(settings => !!settings['git.meta.searchQueryTransformer']),
                first()
            )
            .subscribe(() => {
                sourcegraph.search.registerQueryTransformer({
                    // Register a query transformer to exclude deleted repositories.
                    transformQuery: query => `${query} -r:^bitbucket\.sgdev\.org/SGDEMO`,
                })
            })
    )
}
