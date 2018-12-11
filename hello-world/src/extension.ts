import * as sourcegraph from "sourcegraph";

export function activate(ctx: sourcegraph.ExtensionContext): void {
  ctx.subscriptions.add(
    sourcegraph.languages.registerHoverProvider(["*"], {
      provideHover: (document: sourcegraph.TextDocument, position: sourcegraph.Position) => ({
        contents: {
          value: JSON.stringify(position)
        }
      })
    })
  )
}
