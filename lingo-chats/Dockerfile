FROM node:23-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --only=production

COPY . .

EXPOSE 5000 5001

CMD ["sh", "-c", "npx prisma generate && npx prisma migrate deploy && npm run start"]
