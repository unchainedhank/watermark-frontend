## 使用 nginx 作为基础镜像
#FROM nginx:latest
#
## 将本地构建好的文件复制到 nginx 默认的静态文件路径
#COPY ./dist /usr/share/nginx/html
#COPY ./nginx.conf /etc/nginx/nginx.conf
## 暴露端口
#EXPOSE 5173
#
## 启动 nginx
#CMD ["nginx", "-g", "daemon off;"]
FROM node
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 5173
CMD ["npm", "run", "dev"]