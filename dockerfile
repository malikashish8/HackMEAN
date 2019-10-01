FROM node:10-alpine
WORKDIR /usr/src/app
COPY [".", "./"]
RUN npm install --production 
EXPOSE 8888
CMD ["npm", "start"]
