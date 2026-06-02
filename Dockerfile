FROM node:20-bookworm-slim

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=optional

COPY . .

EXPOSE 4000

CMD ["npm", "start"]
