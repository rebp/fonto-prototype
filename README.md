# fonto-prototype

- [fonto-prototype](#fonto-prototype)
    - [Docker](#docker)
        - [Compose](#compose)
        - [Build](#build)
        - [Run](#run)
        - [Push](#push)

## Docker

### Compose

```yml
version: '3.3'
services:
  fonto-prototype:
    build:
      args:
        FONTO_BITBUCKET_SSH_KEY: <your-key>
```

### Build

```
docker-compose build
```

### Run

```
docker-compose up -d
```

### Push

```
docker-compose push
```

* Registry: fontoxmlstaging.azurecr.io
* Credentials: Ask Erik
