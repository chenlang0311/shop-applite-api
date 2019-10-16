FROM node:10

# Install global pm2 
RUN npm install pm2 -g --registry=https://registry.npm.taobao.org

COPY ./build/ /data/

WORKDIR /data

VOLUME /data
# Bundle app source
CMD ["pm2", "start", "bin/app.json", "--no-daemon"]

EXPOSE 8010