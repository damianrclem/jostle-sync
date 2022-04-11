# syntax=docker/dockerfile:1
FROM node:16 AS build
# to access our internal github npm registry, you need to pass this variable in
ARG NPM_TOKEN

# pull deps and try to cache these layers
WORKDIR /jostle
COPY package.json package.json
COPY yarn.lock yarn.lock
COPY .npmrc .npmrc
RUN yarn install

# build and remove dev dependencies
COPY . .
RUN yarn build && yarn install --production

# runtime
FROM node:16 AS runtime
WORKDIR /jostle
COPY --from=build /jostle .
