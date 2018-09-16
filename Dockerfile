FROM node:10

WORKDIR /src/app

COPY package.json package.json

RUN npm install

COPY views views

COPY src src

CMD npm start