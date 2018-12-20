# Dockerfile lint Sourcegraph extension

A [Sourcegraph extension](https://docs.sourcegraph.com/extensions/) to lint Dockerfiles on [Sourcegraph.com](https://sourcegraph.com) and GitHub using [Hadolint](https://github.com/hadolint/hadolint).

![dockerfile lint github sourcegraph](https://user-images.githubusercontent.com/133014/49892179-2db21980-fdfd-11e8-9076-ef9f4bfae01a.gif)

## Try it on Sourcegraph.com

Head to [Sourcegraph.com](https://sourcegraph.com), create an account, then go to the [Dockerfile lint extension page](https://sourcegraph.com/extensions/ryan-blunden/dockerfile-lint) to enable it. This gets it [working on Sourcegraph](https://sourcegraph.com/github.com/freebroccolo/docker-haskell@master/-/blob/8.6/Dockerfile).

## Try it on GitHub

To lint Dockerfiles on GitHub, install the [Sourcegraph browser extension](https://docs.sourcegraph.com/integration/browser_extension), then:

- Click the Sourcegraph icon to the right of the address bar.
- Click the gear ⚙️ icon.
- Check the **Use extensions** checkbox.

<img alt="Enable extensions in the Sourcegraph browser extension" src="https://docs.sourcegraph.com/extensions/authoring/img/enable-sourcegraph-extensions.png" width="400px" />

Then view a [Dockerfile](https://github.com/freebroccolo/docker-haskell/blob/master/8.6/Dockerfile) to confirm it's working.

## How it works - client

It's a client-server application.

The client is a [Sourcegraph extension](https://sourcegraph.com/extensions/ryan-blunden/dockerfile-lint) which runs on [Sourcegraph.com](https://sourcegraph.com). It also works on GitHub when you [install the Sourcegraph browser extension](https://docs.sourcegraph.com/integration/browser_extension). The extension runs in a [Web Worker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers) for security and isolation.

The server is a [Flask application](http://flask.pocoo.org/) with a `/lint` endpoint that returns JSON when the body of the request contains the contents of a Dockerfile.
