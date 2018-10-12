FROM mhart/alpine-node:10

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 9290
CMD [ "npm", "start" ]