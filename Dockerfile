# Base image
FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package configuration
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Build the NestJS application
RUN npm run build

# Expose the NestJS default port
EXPOSE 3000

# Start the application in production mode
CMD ["npm", "run", "start:prod"]