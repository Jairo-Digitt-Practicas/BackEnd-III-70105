FROM node:18.16.0
WORKDIR /app
COPY package*.json ./
COPY .env .env
COPY . .
RUN npm install
EXPOSE 3001
CMD ["node", "app.js"]
