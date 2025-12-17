# Build Stage
FROM node:lts as build-stage

WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files to the working directory
COPY . .

# Build the Next.js application
RUN npm run build

# Production Stage
FROM node:lts

WORKDIR /app

# Copy only necessary files from build stage
COPY --from=build-stage /app/package*.json ./
COPY --from=build-stage /app/.next ./.next
COPY --from=build-stage /app/public ./public
COPY --from=build-stage /app/next.config.js ./

# Install production dependencies only
RUN npm ci --omit=dev

EXPOSE 3000

# Start Next.js in production mode
CMD ["npm", "start"]

