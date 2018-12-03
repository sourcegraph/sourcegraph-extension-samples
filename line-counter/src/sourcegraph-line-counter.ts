import * as sourcegraph from 'sourcegraph'

/**
 * Returns a CodeEditor instance (if a Window is active) that provides access to
 * the document being viewed.
 */
function activeEditor(): sourcegraph.CodeEditor | undefined {
    return sourcegraph.app.activeWindow
        ? sourcegraph.app.activeWindow.visibleViewComponents[0]
        : undefined
}

/**
 * Display a notification with the filename and line count of the document being viewed.
 * @param editor
 */
function displayLineCount(editor: sourcegraph.CodeEditor | undefined = activeEditor()): void {
    if(!editor) {
        return
    }

    const lineCount = editor.document.text.split(/\n/).length - 1
    const fileName = editor.document.uri.substring(editor.document.uri.lastIndexOf('/') + 1).split('#').slice(-1)[0]
    const message = `The ${fileName} file has ${lineCount} line${lineCount > 1 ? 's' : ''} of code `

    sourcegraph.app.activeWindow!.showNotification(message)
}

/**
 * The activate function is called when one of the extensions `activateEvents`
 * conditions in package.json are satisfied.
 */
export function activate(ctx: sourcegraph.ExtensionContext): void {
    // Add each subscription to the extension's context so they can unsubscribed upon deactivation
    ctx.subscriptions.add(
      sourcegraph.commands.registerCommand('linecounter.displayLineCount', displayLineCount)
    )
}
