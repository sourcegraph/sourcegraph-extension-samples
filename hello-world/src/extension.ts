import * as sourcegraph from "sourcegraph";

export function activate(ctx: sourcegraph.ExtensionContext): void {
  ctx.subscriptions.add(
    sourcegraph.languages.registerHoverProvider(["*"], {
      provideHover: () => ({ contents: { value: "Hello, world! 🎉🎉🎉" } })
    })
  )
}
