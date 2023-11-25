# Use Node.js as the base image
FROM node:latest

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the app source code
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Define the command to run your app using CMD
CMD ["npm", "start"]
