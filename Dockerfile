# Stage 1: Build the Angular application
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install -f

COPY . .

# Use build arguments to specify the environment
ARG CONFIG_ENV=production
RUN npm run build --configuration=$CONFIG_ENV

# Stage 2: Serve the Angular application with Nginx
FROM nginx:alpine

COPY --from=build /app/dist/OncfFrontend /usr/share/nginx/oncfhtml

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 8024

CMD ["nginx", "-g", "daemon off;"]
