FROM node:23-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install --only=production

COPY . .

EXPOSE 5000 5001

CMD ["npm", "run", "start"]
