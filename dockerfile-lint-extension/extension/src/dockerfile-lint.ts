import { commands, configuration, ExtensionContext, Hover, languages, Position, TextDocument, workspace } from 'sourcegraph';
import { fetchResult } from './api';
import { initializeSettings, setServerURL, Settings } from './settings';
import { decorate, getHover } from './ui';
import { activeEditor, memoizeAsync } from './utils'

export async function activate(ctx: ExtensionContext): Promise<void> {
    async function validate(document: TextDocument): Promise<void> {
        const result = await fetchResult(document.text)
        if(result) {
            decorate(result)
        }
    }

    if(configuration.get<Settings>().get('dockerfilelint.enabled') === false) {
        return
    }

    ctx.subscriptions.add(
        languages.registerHoverProvider([{ language: 'dockerfile'}], {
            provideHover: async (document: TextDocument, position: Position) => {
                const result = await fetchResult(document.text)
                if(!result) {
                    return undefined
                }

                return getHover(document.text, position, result)
            }
        })
    )

    ctx.subscriptions.add(
        commands.registerCommand('dockerfilelint.setServerURL', async (editor = activeEditor()) => {
            if(!editor || await setServerURL() === null) {
                return
            }

            await validate(editor.document)
        })
    )

    async function initialize(editor = activeEditor()): Promise<any> {
        if(!editor) {
            return setTimeout(initialize, 100);
        }

        await initializeSettings()
        await validate(editor.document)
    }

    await initialize()
}
