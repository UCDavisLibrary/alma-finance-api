FROM node:20-alpine

WORKDIR /alma-sync

COPY package*.json ./
RUN npm install --omit=dev

COPY src ./src

CMD ["npm", "start"]
