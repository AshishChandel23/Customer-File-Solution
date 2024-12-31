# Use the Node.js 20 image as the base
FROM node:20

# Set the working directory inside the container
WORKDIR /user/app

# Copy the package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Compile TypeScript into JavaScript
RUN npm run build

# Set environment variables if we want to run container through the docker file (if not used compose file)
ENV PORT=3000
ENV MONGODB_URL='mongodb+srv://alan:root@cluster0.314okak.mongodb.net/ImageServer?retryWrites=true&w=majority&appName=Cluster'

# Expose the application port
EXPOSE 3001

# Start the application
ENTRYPOINT [ "npm", "run", "start"]
