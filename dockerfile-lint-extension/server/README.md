# Dockerfile lint server (WIP)

Flask server that uses [Hadolint](https://github.com/hadolint/hadolint) for linting Dockerfiles.

It can be run as a Docker container or any serverless platform supported by Zappa.

## Usage

Build:

```make build```

Run:

```make run```

Run for development (with auto-reloads on code change):

```make dev```

Use:

Post a Dockerfile to the `/lint` endpoint.

```shell
curl -X POST 'http://localhost:5000/lint' \
    -H 'Content-Type: application/octet-stream' \
    --data-binary @Dockerfile
```

The server allows access from any origin so it can be called from a browser on any domain.

**Note**: It should come as no surprise that running `make docker-lint` uses [Hadolint](https://github.com/hadolint/hadolint).
