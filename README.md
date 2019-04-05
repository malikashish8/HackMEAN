[![Build Status](https://travis-ci.com/malikashish8/HackMEAN.svg?branch=master)](https://travis-ci.com/malikashish8/HackMEAN)

# HackMean
Intentionally vulnerable app built on MEAN stack (MongoDB, Express, Angular and Node.js) 

## Pre-requisites:
- Node.js
- NPM
- MongoDB (on a docker container)

You can spin up a docker container for mongoDB and map the data folder from the host machine to the container as in the example below:
```
docker run -d -p 27017:27017 -v HackMEAN_mongo:/data/db --name hackMEAN_mongo mongo
```

## Installation
```
git clone https://github.com/malikashish8/HackMEAN.git
cd HackMEAN
npm install --production
npm start
```
