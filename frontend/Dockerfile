# Step 1: Use Node.js image to build the React app
FROM node:22 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./

RUN npm install

# Copy all the project files to the container
COPY . .

# Build the React app
RUN npm run build

# Step 2: Serve the React app using a lightweight web server
FROM nginx:alpine

# Remove the default Nginx configuration file
RUN rm -rf /usr/share/nginx/html/*

# Copy the build files from the previous stage
COPY --from=build /app/build /usr/share/nginx/html

# Expose the port that Nginx will run on
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
