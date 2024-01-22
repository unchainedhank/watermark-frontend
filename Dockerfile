#FROM node:18-alpine as BUILD_IMAGE
#WORKDIR /app/wm-app
#
#COPY package.json .
#
#RUN npm install
#
#COPY . .
#
#RUN npm run build
#
#
#FROM node:18-alpine as PROD_IMAGE
#WORKDIR /app/wm-app
#
#COPY --from=BUILD_IMAGE /app/wm-app/dist/ /app/wm-app/dist/
#
#EXPOSE 3000
#COPY package.json .
#COPY vite.config.ts .
#RUN npm install typescript
#CMD ["npm","run","preview"]
#

FROM node:latest as BUILD_IMAGE
WORKDIR /app

COPY . .
RUN npm i
RUN npm run build

FROM nginx:1.21.0-alpine
COPY --from=BUILD_IMAGE /app/dist/ /usr/share/nginx/html/
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
