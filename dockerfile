# Node server
FROM node:8.11-alpine
WORKDIR /usr/src/app
COPY [".", "./"]
RUN npm install --production --silent
EXPOSE 3000
CMD ["npm", "start"]
