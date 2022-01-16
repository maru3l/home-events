# Build Stage 1
# This build created a staging docker image
FROM node:lts-alpine AS build

# Create app directory
WORKDIR /app

COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]

RUN npm install --silent

COPY . .

RUN npm run build

# Build Stage 2
# This build takes the production build from staging build
FROM node:lts-alpine

ENV PORT 3000
ENV NODE_ENV production

# Create app directory
WORKDIR /app

# Install app dependencies
# COPY --chown=node:node package.json ./
COPY package.json ./

# RUN npm ci
RUN npm install --only=production

# Bundle app source
COPY --chown=node:node --from=build /app/dist ./dist
COPY --chown=node:node config ./config

EXPOSE ${PORT}

USER node

CMD ["node", "dist/bin/www"]
