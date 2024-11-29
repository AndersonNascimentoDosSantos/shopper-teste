# Usar a imagem base do Nginx
FROM nginx:alpine

# Criar o diretório para o cache no contêiner
RUN mkdir -p /var/cache/nginx && \
    chown -R nginx:nginx /var/cache/nginx

# Copiar a configuração customizada do Nginx
COPY nginx/nginx.conf /etc/nginx/nginx.conf

# Expor a porta padrão do Nginx
EXPOSE 80

# Comando padrão para iniciar o Nginx
CMD ["nginx", "-g", "daemon off;"]
