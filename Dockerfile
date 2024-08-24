FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install -g npm@10.8.2

RUN npm install -g yarn

RUN yarn install

COPY . .

EXPOSE 8800

CMD [“yarn”, “start”]