# WIP: Dockerfile lint

# Dockerfile lint Sourcegraph extension

A [Sourcegraph extension](https://docs.sourcegraph.com/extensions/) to lint Dockerfiles on [Sourcegraph.com](https://sourcegraph.com) and GitHub using [Hadolint](https://github.com/hadolint/hadolint).

![dockerfile lint github sourcegraph](https://user-images.githubusercontent.com/133014/49892179-2db21980-fdfd-11e8-9076-ef9f4bfae01a.gif))

## Try it on GitHub

To lint Dockerfiles on GitHub, install the [Sourcegraph browser extension](https://docs.sourcegraph.com/integration/browser_extension), then:

- Click the Sourcegraph icon to the right of the address bar.
- Click the gear ⚙️ icon.
- Check the **Use extensions** checkbox.

<img alt="Enable extensions in the Sourcegraph browser extension" src="https://docs.sourcegraph.com/extensions/authoring/img/enable-sourcegraph-extensions.png" width="400px" />

Then view a [Dockerfile](https://github.com/freebroccolo/docker-haskell/blob/master/8.6/Dockerfile) to confirm it's working.
