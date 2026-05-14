# Stage 1: Build the React frontend
FROM node:20-alpine AS frontend-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# Stage 2: Setup the Express backend and serve the app
FROM node:20-alpine
WORKDIR /app/server
COPY server/package*.json ./
RUN npm install --production
COPY server/ ./

# Copy built static files from frontend stage
COPY --from=frontend-build /app/client/dist /app/client/dist

# Expose port
EXPOSE 8080

# Start server
CMD ["npm", "start"]
