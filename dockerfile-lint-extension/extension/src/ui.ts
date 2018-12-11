import { DecorationAttachmentRenderOptions, Hover, MarkupKind, Position, Range, TextDocument, TextDocumentDecoration } from 'sourcegraph';
import { Lint, LintResult } from './api';
import { activeEditor } from './utils';

function getDecorations(result: LintResult): TextDocumentDecoration[] {
    const linesProcessed = new Set()

    return (result.lint.filter(lint => {
        if(!linesProcessed.has(lint.line)) {
            linesProcessed.add(lint.line)
            return true
        }
    })).map(lint => ({
            range: new Range(lint.line - 1, 0, lint.line - 1, lint.lint.length - 1), // -1 because lines are 0 indexed
            border: 'solid',
            borderWidth: '0 0 0 10px',
            borderColor: 'red',
            backgroundColor: 'hsla(0,100%,50%, 0.2)',
            after: {
                contentText: '❗'
            }
        })
    )
}

export function decorate(result: LintResult): void {
    const editor = activeEditor()
    if(!editor) {
        return
    }

    editor.setDecorations(null, getDecorations(result))
}

export function getHover(dockerfile: string, position: Position, result: LintResult): Hover | null {
    const lineNumber = position.line + 1
    const content = (lint: Lint[]): string =>
        ['# Dockerfile lint recommendations\n---\n'].concat(lint.map(lint => lint.lint)).join('\n- \n')

    if(!result || !result.lintForLine[lineNumber]) {
        return null
    }

    const lint = result.lintForLine[position.line+1]
    const lineCharCount = dockerfile.split('\n')[position.line].length - 1
    const range = new Range(position.line, 0, position.line, lineCharCount)

    return {
        contents: {
            value: content(lint),
            kind: MarkupKind.Markdown
        },
        range
    }
}
