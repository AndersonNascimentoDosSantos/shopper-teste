# Dockerfile

FROM node:20-alpine

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app


COPY package*.json ./

RUN npm install --verbose

COPY . .

COPY --chown=node:node . .

RUN ls -la && \
    cat package.json && \
    npm run build || (echo "Build failed" && exit 1)
    
EXPOSE 8080

CMD ["npm", "run", "start"]