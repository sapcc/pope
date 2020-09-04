FROM mhart/alpine-node:10
LABEL source_repository="https://github.com/sapcc/pope"

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 9290
CMD [ "npm", "start" ]
