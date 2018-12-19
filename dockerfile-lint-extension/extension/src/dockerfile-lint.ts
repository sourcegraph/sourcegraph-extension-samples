import { commands, configuration, ExtensionContext, languages, Position, TextDocument } from 'sourcegraph';
import { fetchResult } from './api';
import { initializeSettings, setServerURL, Settings } from './settings';
import { decorate, getHover, removeDecorations } from './ui';
import { activeEditor } from './utils'

export async function activate(ctx: ExtensionContext): Promise<void> {
    async function initialize(): Promise<any> {
        const editor = await activeEditor()

        await initializeSettings()

        if(configuration.get<Settings>().get('dockerfilelint.enabled')) {
            await validate(editor.document)
        }
    }

    async function onConfigurationUpdate(): Promise<void> {
        const editor = await activeEditor()

        if(!configuration.get<Settings>().get('dockerfilelint.enabled')) {
            removeDecorations()
            return
        }

        await validate(editor.document)
    }

    async function validate(document: TextDocument): Promise<void> {
        const result = await fetchResult(document.text)
        if(result) {
            decorate(result)
        }
    }

    ctx.subscriptions.add(
        /**
         * The `{ language: 'dockerfile'}` document selector is set because once the extension is activated,
         * it is not deactivated when `activateConditions` are no longer true.
         */
        languages.registerHoverProvider([{ language: 'dockerfile'}], {
            provideHover: async (document: TextDocument, position: Position) => {
                const result = await fetchResult(document.text)
                const enabled = configuration.get<Settings>().get('dockerfilelint.enabled')

                /**
                 * We check for enabled because `dockerfilelint.enabled` could be set to false
                 * but the extension is still activated and therefore, hover events will still fire.
                 */
                if(!result || !enabled) {
                    return undefined
                }

                return getHover(document.text, position, result)
            }
        })
    )

    ctx.subscriptions.add(
        commands.registerCommand('dockerfilelint.setServerURL', async () => {
            const editor = await activeEditor()
            if(!editor || await setServerURL() === null) {
                return
            }

            await validate(editor.document)
        })
    )

    ctx.subscriptions.add(
        configuration.subscribe(onConfigurationUpdate)
    )

    await initialize()
}
