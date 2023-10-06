# Stage 1
FROM node:18-alpine as build-stage

WORKDIR /client
COPY package.json .
RUN npm install
COPY . .

ARG API_BASE_URL
ENV API_BASE_URL=$API_BASE_URL

RUN npm run build

# Stage 2
FROM nginx:1.17.0-alpine

COPY --from=build-stage /client/dist /usr/share/nginx/html
EXPOSE $VUE_DOCKER_PORT

CMD nginx -g 'daemon off;'