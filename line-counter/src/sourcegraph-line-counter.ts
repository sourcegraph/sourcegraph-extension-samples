import * as sourcegraph from 'sourcegraph'

export function activate(): void {
  const commandKey = 'linecounter.displayLineCount'

  sourcegraph.commands.registerCommand(commandKey, (uri:string, text: string) => {
    const activeWindow: sourcegraph.Window | undefined = sourcegraph.app.activeWindow
    if(!activeWindow) {
        return;
    }

    const lineCount = text.split(/\n/).length - 1;
    const fileName = uri.substring(uri.lastIndexOf('/') + 1);

    activeWindow.showNotification(`The ${fileName} file has ${lineCount} line${lineCount > 1 ? 's' : ''} of code `)
  })
}
