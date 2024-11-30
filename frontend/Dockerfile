# Dockerfile

# Usar uma imagem base do Node.js
FROM node:20 AS build

# Definir o diretório de trabalho
WORKDIR /app
# Definir uma variável de build para receber o valor da API Key
ARG REACT_APP_GOOGLE_API_KEY
ENV REACT_APP_GOOGLE_API_KEY=$REACT_APP_GOOGLE_API_KEY

# Copiar os arquivos de configuração do package.json e package-lock.json
COPY package*.json ./

# Instalar as dependências
RUN npm install

# Copiar todos os arquivos da aplicação
COPY . .

# Construir a aplicação React
RUN npm run build

# Usar uma imagem base do Nginx para servir a aplicação
FROM nginx:alpine

# Copiar os arquivos construídos para o diretório padrão do Nginx
COPY --from=build /app/build /usr/share/nginx/html

RUN echo $REACT_APP_GOOGLE_API_KEY
# Expor a porta 80
EXPOSE 80

# Comando para iniciar o Nginx
CMD ["nginx", "-g", "daemon off;"]