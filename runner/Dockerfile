# syntax=docker/dockerfile:1

FROM node:alpine

WORKDIR /runner

COPY package.json tsconfig.json ./

COPY ./index.ts .

RUN yarn install

CMD ["yarn", "boot"]