FROM node:20-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy backend source files only (not frontend)
COPY webServer.js ./
COPY controllers ./controllers
COPY schema ./schema

EXPOSE 3001

CMD ["node", "webServer.js"]
