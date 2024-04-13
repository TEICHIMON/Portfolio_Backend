#FROM node:21-alpine
#WORKDIR /app
#COPY ./package*.json ./
#RUN yarn install
#COPY . .
#CMD ["yarn", "run", "start:dev"]
FROM node:21-alpine AS build

WORKDIR /app

COPY ./package*.json ./
RUN yarn install

COPY . .
RUN yarn build

FROM node:21-alpine

WORKDIR /app

COPY --from=build /app/package*.json ./
RUN yarn install --production

COPY --from=build /app/dist ./dist

CMD ["yarn", "start:prod"]
