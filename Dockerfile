# syntax=docker/dockerfile:1

FROM node:alpine

WORKDIR /app

COPY package.json .

COPY ./src .

RUN yarn install

CMD ["yarn", "dev"]