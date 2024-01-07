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
EXPOSE 9191
CMD [ "npm", "start"]
#CMD [ "nodemon", ""]

#docker build -t backend:0.1.1 .
#docker run -p 8080:9090 backend:0.1.1
#docker tag backend:0.1.2 jordipie/backend:0.1.2