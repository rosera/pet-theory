FROM ubuntu:18.04 
RUN apt-get update && apt-get install -y curl sudo
RUN apt install -y make build-essential

RUN curl -fsSL https://deb.nodesource.com/setup_12.x | sudo -E bash -
RUN sudo apt-get install -y nodejs

WORKDIR /usr/src/app
COPY package.json package*.json ./
RUN npm install 
RUN npm audit fix
COPY . .
CMD [ "npm", "start" ]
