FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install -g npm@10.8.2

RUN npm install

COPY . .

EXPOSE 8801

CMD ["node", "index.js"]