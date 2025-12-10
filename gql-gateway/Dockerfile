FROM node:20-alpine

# Set the working directory to /usr/src/app inside the container
WORKDIR /usr/src/app  # You can choose any directory name here, it matches where files will be copied

# Copy package.json and package-lock.json for efficient caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code (including server.js) into the container
COPY . .

# Expose the port for the application
EXPOSE 4000

# Run the application (server.js is now in /usr/src/app)
CMD ["node", "server.js"]
