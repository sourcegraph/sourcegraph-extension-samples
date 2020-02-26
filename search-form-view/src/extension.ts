import * as sourcegraph from 'sourcegraph'
import { BehaviorSubject, from, combineLatest, of } from 'rxjs'
import { switchMap } from 'rxjs/operators'

const VERSIONS = ['latest', 'v21', 'v20', 'v19'] as const

type Version = typeof VERSIONS[number]

const VERSION_TO_REPO_COMMITS: Record<Version, { [repo: string]: string }> = {
    latest: {
        'github.com/sd9/create-extension': 'HEAD',
        'github.com/sd9/dynomite-manager': 'HEAD',
        'github.com/sd9/eslint-formatter-lsif': 'HEAD',
        'github.com/sd9/go-imports-search': 'HEAD',
    },
    v21: {
        'github.com/sd9/create-extension': '4b941f1',
        'github.com/sd9/dynomite-manager': '8d88389',
        'github.com/sd9/eslint-formatter-lsif': '0c7c2d2',
        'github.com/sd9/go-imports-search': '0c8142f',
    },
    v20: {
        'github.com/sd9/create-extension': 'ef00b45',
        'github.com/sd9/dynomite-manager': 'd0c1b79',
        'github.com/sd9/eslint-formatter-lsif': 'a432870',
        'github.com/sd9/go-imports-search': 'b8e24a4',
    },
    v19: {
        'github.com/sd9/create-extension': '7982969',
        'github.com/sd9/dynomite-manager': 'c9eccaa',
        'github.com/sd9/eslint-formatter-lsif': '3d0b413',
        'github.com/sd9/go-imports-search': '759e8e1',
    },
}

const queryReposAndCommitsForReleaseVersion = (version: Version): Promise<{ [repo: string]: string }> =>
    Promise.resolve(VERSION_TO_REPO_COMMITS[version])

const VIEW_ID = 'searchHelperSample.view'
const FORM_SUBMIT_COMMAND_ID = 'searchHelperSample.submit'
const FORM_CHANGE_COMMAND_ID = 'searchHelperSample.change'

interface FormValue {
    query: string
    version: Version
    language: string
}

const formValue = new BehaviorSubject<FormValue | undefined>(undefined)

export function activate(ctx: sourcegraph.ExtensionContext): void {
    ctx.subscriptions.add(
        sourcegraph.commands.registerCommand(
            FORM_CHANGE_COMMAND_ID,
            (value: FormValue): Promise<void> => {
                formValue.next(value)
                return Promise.resolve()
            }
        )
    )

    ctx.subscriptions.add(
        sourcegraph.commands.registerCommand(FORM_SUBMIT_COMMAND_ID, async (value: FormValue) => {
            const repoCommits = await queryReposAndCommitsForReleaseVersion(value.version)
            const repoCommitFilters = Object.entries(repoCommits).map(
                ([repo, commit]) => `repo:^${escapeRegExp(repo)}$@${commit}`
            )
            const langFilters = value.language ? [`lang:${value.language}`] : []
            await sourcegraph.commands.executeCommand(
                'open',

                `/search?q=${encodeURIComponent([value.query, ...langFilters, ...repoCommitFilters].join(' '))}`
            )
        })
    )

    const view = sourcegraph.app.createPanelView(VIEW_ID)
    ctx.subscriptions.add(
        combineLatest([
            formValue,
            formValue.pipe(
                switchMap(value => (value ? from(queryReposAndCommitsForReleaseVersion(value?.version)) : of(null)))
            ),
        ]).subscribe(([value, repoCommits]) => {
            if (value && repoCommits) {
                view.title = `Release version ${value.version}`
                view.content =
                    'Searching repositories at versions:\n\n' +
                    Object.entries(repoCommits)
                        .map(([repo, commit]) => `- ${repo} @ ${commit}`)
                        .join('\n')
            } else {
                view.title = 'Loading...'
                view.content = ''
            }
        })
    )
}

function escapeRegExp(str: string): string {
    return str.replace(/\./g, '\\.')
}
