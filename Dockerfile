FROM node:13.12.0-alpine

WORKDIR /app/frontend

ENV PATH /app/frontend/node_modules/.bin:$PATH

COPY package.json .
COPY package-lock.json .

RUN npm install --silent
RUN npm install react-scripts -g --silent

COPY . .

EXPOSE 3000
