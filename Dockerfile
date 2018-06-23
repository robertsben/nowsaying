FROM node:10

WORKDIR /src/app

COPY package.json package.json

RUN npm install

COPY ./src src

CMD npm start