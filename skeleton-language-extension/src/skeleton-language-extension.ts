import * as sourcegraph from 'sourcegraph'

export function activate(): void {
   // TODO replace this stub implementation with a real connection to
   // the language server (e.g. over WebSockets).
   const connectionToLanguageServer = {
      textDocumentHover: (doc, position) => {
         return Promise.resolve(`Hello world from Skeleton language extension! 🎉🎉🎉 Line:char ${position.line}:${position.character}`)
      }
   }

   sourcegraph.languages.registerHoverProvider(['*'], {
       provideHover: async (doc, position) => {
          const response = await connectionToLanguageServer.textDocumentHover(doc, position)
          return { contents: { value: response } }
       }
   })

   // Check out the docs for how to implement jump-to-definition and find-references:
   // - https://github.com/sourcegraph/sourcegraph-extension-docs
}

