FROM node:20-alpine AS builder
WORKDIR /app


COPY package*.json ./

RUN npm install -g npm@11.0.0
RUN npm install --legacy-peer-deps
COPY . .

RUN npm run build

# Step 2: Create the production image
FROM nginx:alpine

# Copy the custom NGINX config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the static files from the build stage
COPY --from=builder /app/dist /usr/share/nginx/html

ARG VITE_API_BASE_URL
ARG VITE_APP_ENV
ARG VITE_API_TIMEOUT=8000


ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
ENV VITE_APP_ENV=${VITE_APP_ENV}
ENV VITE_API_TIMEOUT=${VITE_API_TIMEOUT}

# Expose the desired port
EXPOSE 3663

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]
