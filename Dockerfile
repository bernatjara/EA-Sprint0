FROM node:18.16.0-alpine3.17
RUN mkdir -p /opt/app
WORKDIR /opt/app
COPY package.json .
COPY package-lock.json .
COPY tsconfig.json .
COPY .env .
RUN npm install
#RUN npm install nodemon prettier ts-node typescript
RUN mkdir src
COPY src/ src
RUN npm run build 
EXPOSE 9090
CMD [ "npm", "start"]
#CMD [ "nodemon", ""]

#docker build -t node-app:1.0 .
