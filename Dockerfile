# Common build stage
FROM node:18-alpine as common-build-stage

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV PORT=5000

EXPOSE 5000

# Development build stage
# FROM common-build-stage as development-build-stage

# ENV NODE_ENV development

# CMD ["npm", "run", "dev"]

# Production build stage
FROM common-build-stage as production-build-stage

# ENV NODE_ENV production
# Set environment variables
ENV NODE_ENV=production

# Run migrations before starting the server
CMD npm run build && npm run migration:run && npm run start
