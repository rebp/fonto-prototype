FROM node:alpine

RUN apk add \
    --no-cache \
    --update \
        git \
        openssh

ARG FONTO_BITBUCKET_SSH_KEY
RUN mkdir ~/.ssh && \
    ssh-keyscan bitbucket.org >> ~/.ssh/known_hosts && \
    ssh-keyscan github.com >> ~/.ssh/known_hosts && \
    echo "${FONTO_BITBUCKET_SSH_KEY}" | base64 -d > ~/.ssh/id_rsa && \
    chmod 700 ~/.ssh && \
    chmod 600 ~/.ssh/id_rsa

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 3000 3005

CMD npm start
