# syntax=docker/dockerfile:1

FROM node:alpine

WORKDIR /engine

COPY package.json .

COPY ./src .

RUN yarn install

CMD ["yarn", "start"]