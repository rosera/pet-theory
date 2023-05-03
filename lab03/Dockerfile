FROM node:16
WORKDIR /usr/src/app
COPY package.json package*.json ./
RUN npm install --only=production
COPY . .
CMD [ "npm", "start" ]
