# Stage 1: Build
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies weight
RUN npm install

# Copy source files
COPY . .

# Build the project
RUN npm run build

# Stage 2: Serve
FROM nginx:stable-alpine

# Copy build output to nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
