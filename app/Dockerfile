FROM node

WORKDIR /app

COPY package.json .

RUN npm install

COPY . /app

RUN npm run client-build

ENV CLIENT_ASSET_MODE=dist

EXPOSE 5000

CMD ["npm", "start"]
