FROM nextegomobile.azurecr.io/ego-microservice-image:node-16

# create app directory
WORKDIR /usr/src/app

# install app dependencies a wildcard is used to ensure both package.json
# AND package-lock.json are copied where available (npm@5+)
COPY package*.json ./

# bundle app source
COPY . .

# install, build and production install
RUN npm install && \
    npm run build && \
    rm -rf node_modules && \
    npm install --production

# expose ports
EXPOSE 80

# start
CMD sh -c "cd /usr/src/app && npm start"
