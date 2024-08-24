FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --global yarn

RUN yarn install

COPY . .

EXPOSE 8800

CMD [“yarn”, “start”]