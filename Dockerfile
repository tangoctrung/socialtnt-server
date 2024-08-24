FROM node:16.18.0

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8800

CMD [“npm”, “start”]