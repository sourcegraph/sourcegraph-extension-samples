# WIP: Building a Sourcegraph extension to show npm stats next to import/require statements

[Sourcegraph extensions](https://docs.sourcegraph.com/extensions) let you add features and show new kinds of information on your code on Sourcegraph, GitHub, and other tools. This guide shows you how to create a simple Sourcegraph extension that:

- Shows the [npm](https://npmjs.com) weekly download count next to your JavaScript/TypeScript code's `import` or `require` statements
- Works on all code on GitHub (requires [Sourcegraph for Chrome](https://chrome.google.com/webstore/detail/sourcegraph/dgjhfomjieaadpoljlnidmbgkdffpack) or [Sourcegraph for Firefox](https://addons.mozilla.org/en-US/firefox/addon/sourcegraph/))
- Works on all code on Sourcegraph
- Runs entirely client-side in the browser (your code remains local and is not sent to any server)

```json
{
 "name": "sourcegraph-npm-stats",
 "publisher": "sqs",
 "title": "npm package stats",
 "description": "Shows npm weekly download counts next to import and require statements in JavaScript/TypeScript code.",
 "activationEvents": [
  "*"
 ],
 "main": "dist/extension.js",
 "scripts": {
  "sourcegraph:prepublish": "parcel build src/extension.ts"
 },
 "devDependencies": {
  "parcel-bundler": "^1.9.7",
  "sourcegraph": "^16.0.0",
  "typescript": "^3.0.3"
 }
}
```
