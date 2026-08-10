FROM node:20-alpine

WORKDIR /app

COPY package.json ./
COPY backend/package.json backend/package.json
COPY backend/package-lock.json backend/package-lock.json

RUN npm --prefix backend ci --include=dev

COPY . .

RUN npm --prefix backend run build

CMD ["npm", "start"]
