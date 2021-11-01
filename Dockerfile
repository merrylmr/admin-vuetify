
FROM nginx:1.14-alpine
COPY dist /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx","-g" ,"daemon off;"]
