FROM node:12.10

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY ./src ./src/

EXPOSE 3000

ENTRYPOINT ["npm", "start"]
