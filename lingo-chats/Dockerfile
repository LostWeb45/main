FROM node:23-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install --only=production

COPY . .

RUN npx prisma generate && npx prisma migrate deploy

EXPOSE 5000 5001

CMD ["npm", "run", "start"]
