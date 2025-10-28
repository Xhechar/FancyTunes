
FROM node:alpine as build
WORKDIR /app
COPY package*.json .
RUN mpm install
COPY . .
RUN npm build

FROM node:alpine as production
WORKDIR /app