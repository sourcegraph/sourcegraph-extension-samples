
import { app, configuration } from 'sourcegraph';

interface AllSettings {
    'dockerfilelint.enabled': boolean
    'dockerfilelint.shownURLPrompt': boolean
    'dockerfilelint.serverURL': string
}

const DEFAULT_SETTINGS: AllSettings = {
    'dockerfilelint.enabled': true,
    'dockerfilelint.shownURLPrompt': false,
    'dockerfilelint.serverURL': ''
}

export type Settings = Partial<AllSettings>

export async function initializeSettings():Promise<void> {
    const URL_PROMPT = 'Enable Dockerfile linting by setting the server URL from the command palette.'

    // Wait until window exists as we need it prompting for the Dockerfile lint server URL
    const window = app.activeWindow || undefined
    if(!window) {
        setTimeout(initializeSettings, 100)
        return
    }

    for (const settingKey of Object.keys(DEFAULT_SETTINGS)) {
        const localValue = configuration.get<Settings>().get(settingKey as keyof AllSettings)
        if (localValue === undefined) {
            await configuration.get<Settings>().update(settingKey as keyof AllSettings, DEFAULT_SETTINGS[settingKey as keyof AllSettings])
        }
    }

    if (!configuration.get<Settings>().get('dockerfilelint.serverURL')) {
        console.warn(URL_PROMPT)

        if(!configuration.get<Settings>().get('dockerfilelint.shownURLPrompt')) {
            await configuration.get<Settings>().update('dockerfilelint.shownURLPrompt', true)
            await window.showMessage(URL_PROMPT)
        }
    }
}

export async function setServerURL(): Promise<void | null> {
    const window = app.activeWindow || undefined
    if(!window) {
        return null
    }

    const serverURLRawValue = await window.showInputBox({ prompt: 'Dockerfile lint server host and domain', value: configuration.get<Settings>().get('dockerfilelint.serverURL')})
    if(!serverURLRawValue) {
        return null
    }

    const url = urlWithOnlyProtocolAndHost(serverURLRawValue)
    await configuration.get<Settings>().update('dockerfilelint.serverURL', url)
}

function urlWithOnlyProtocolAndHost(urlStr: string): string {
    const url = new URL(urlStr)
    return `${url.protocol}//${url.host}`
}
