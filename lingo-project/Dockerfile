FROM node:23-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm install --legacy-peer-deps

EXPOSE 3000

CMD ["npm", "run", "start"]
