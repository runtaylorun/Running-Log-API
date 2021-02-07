FROM node:14.15.1-alpine3.10

# set working directory
WORKDIR /usr/src/app

# copy all files to the container
COPY . .

# install dependencies
RUN npm install

# define the port number that should be exposed
EXPOSE 5000

# run the command to start the app
CMD ["node", "./index.js"]