FROM node:20-alpine

WORKDIR /app

# Copie o .env se necessário
COPY .env .env

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

# Gere o Prisma Client
RUN npx prisma generate

COPY . .

RUN npm run build

EXPOSE 8080

CMD ["npm", "start"]