
# This applicaiton uses MongoDB. You can a docker container for mongoDB and map the data folder from the host machine to the container as in the example below:
# Run mongodb docker container and map it to data
sudo docker run -d -p 27017:27017 -v ~/Desktop/nodejs/mongo:/data/db mongo

