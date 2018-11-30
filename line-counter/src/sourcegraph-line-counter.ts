import * as sourcegraph from 'sourcegraph'

function activeEditor(): sourcegraph.CodeEditor | undefined {
    return sourcegraph.app.activeWindow
        ? sourcegraph.app.activeWindow.visibleViewComponents[0]
        : undefined
}

export function activate(): void {
  sourcegraph.commands.registerCommand('linecounter.displayLineCount', (editor: sourcegraph.CodeEditor | undefined = activeEditor()) => {
    if(!editor) {
        return;
    }

    const lineCount = editor.document.text.split(/\n/).length - 1
    const fileName = editor.document.uri.substring(editor.document.uri.lastIndexOf('/') + 1).split('#').slice(-1)[0]

    sourcegraph.app.activeWindow!.showNotification(`The ${fileName} file has ${lineCount} line${lineCount > 1 ? 's' : ''} of code `)
  })
}
