FROM node:7-slim
ENV NODE_ENV production

# Create app directory
RUN mkdir -p /app/
WORKDIR /app/
COPY package.json /app/
RUN npm install

ADD . /app/
RUN npm run build

EXPOSE 8080
CMD npm start

