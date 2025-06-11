FROM node:23-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps --production

COPY . .

ENV NODE_OPTIONS=--max_old_space_size=4096


RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start", "--", "-H", "0.0.0.0"]
