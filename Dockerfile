FROM ubuntu:vivid-20151106

ENV NODE_VERSION 5.1.0

RUN apt-get update && \
    apt-get install -y \
        curl=7.38.0-3ubuntu2.2 && \
        git=1:2.1.4-2.1

RUN curl -SLO "https://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION-linux-x64.tar.gz" && \
    tar -xzf "node-v$NODE_VERSION-linux-x64.tar.gz" -C /usr/local --strip-components=1 && \
    rm "node-v$NODE_VERSION-linux-x64.tar.gz"

COPY ./package.json /app/
RUN cd /app && \
    npm install

COPY . /app

CMD cd /app && node server.js
