import { configuration, TextDocument } from 'sourcegraph'
import { Settings } from './settings'
import { memoizeAsync } from './utils'

export interface Lint {
    readonly line: number
    readonly lint: string
}
export interface  LintResult {
    readonly lint: Lint[]
    lintForLine: {[line:number]:Lint[]}
}

export const fetchResult = memoizeAsync(
    async function fetchResult(dockerfile: string):Promise<LintResult | undefined> {
        const url = configuration.get<Settings>().get('dockerfilelint.serverURL') + '/lint'
        if(!url) {
            console.debug('dockerfilelint: Aborting lint request, server is undefined')
            return undefined
        }

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/octet-stream',
            },
            body: dockerfile
        })

        const data = await response.json()

        const lintResult:LintResult = {
            lint: data.lint,
            lintForLine: {}
        }

        lintResult.lint.map(lint =>
            lintResult.lintForLine[lint.line] ? lintResult.lintForLine[lint.line].push(lint) : lintResult.lintForLine[lint.line] = [lint]
        )

        return lintResult
    }
)
