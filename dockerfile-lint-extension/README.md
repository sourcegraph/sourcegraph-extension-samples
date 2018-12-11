# Dockerfile lint Sourcegraph extension

A [Sourcegraph extension](http://flask.pocoo.org/) to lint Dockerfiles on [Sourcegraph.com](https://sourcegraph.com) and GitHub using [Hadolint](https://github.com/hadolint/hadolint).

It was developed to learn about the [Sourcegraph extension API](https://docs.sourcegraph.com/extensions/authoring) and the challenges associated with an extension requiring a hosted service.

## How it works

It's a client server application.

## The client

The client is a [Sourcegraph extension](https://sourcegraph.com/extensions/ryan-blunden/dockerfile-lint) which runs on [Sourcegraph.com](https://sourcegraph.com) and GitHub, if you [install the Sourcegraph browser extension](https://docs.sourcegraph.com/integration/browser_extension). It runs in a [Web Worker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers) for security and isolation.

## The server

The server is a [Flask application](http://flask.pocoo.org/) with a `/lint` endpoint.
