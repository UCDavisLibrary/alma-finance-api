FROM node

WORKDIR /file-loader

COPY package.json .

RUN npm install

COPY . /file-loader

CMD ["npm", "run", "start"]