FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY dist ./dist

EXPOSE 5000

ENV NODE_ENV=production

CMD ["node", "dist/index.js"]
