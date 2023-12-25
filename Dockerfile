# 使用 nginx 作为基础镜像
FROM nginx:latest

# 将本地构建好的文件复制到 nginx 默认的静态文件路径
COPY ./dist /usr/share/nginx/html

# 暴露端口
EXPOSE 80

# 启动 nginx
CMD ["nginx", "-g", "daemon off;"]
