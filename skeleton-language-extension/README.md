# Skeleton language extension

Minimal example of a language extension.

![](https://user-images.githubusercontent.com/1387653/50319884-86795600-047e-11e9-8535-aaa8b3bc8e54.png)

## Prerequisites

Sourcegraph extensions are written in TypeScript and are distributed as bundled JavaScript files that run on the client. For creation, publishing, and viewing, you need:

- **Creation**: Install [Node.js](https://nodejs.org).
- **Publishing**: Install the [Sourcegraph CLI (`src`)](https://github.com/sourcegraph/src-cli#installation) and create a [Sourcegraph.com account](https://sourcegraph.com/sign-up).
- **Viewing**: Install the Sourcegraph extension for [Chrome](https://chrome.google.com/webstore/detail/sourcegraph/dgjhfomjieaadpoljlnidmbgkdffpack) or [Firefox](https://addons.mozilla.org/en-US/firefox/addon/sourcegraph/).

## Set up

```
npm install
```

## Lint and type check

```
npm run tslint
npm run typecheck
```

## Publish

```
src extensions publish
```

## Sourcegraph extension API

Visit the [Sourcegraph extension documentation](https://github.com/sourcegraph/sourcegraph-extension-docs) and check out some [Sourcegraph extension samples](https://github.com/sourcegraph/sourcegraph-extension-samples).
