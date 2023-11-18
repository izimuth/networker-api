FROM node:18
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

WORKDIR /build
COPY ./build /build/
COPY ./package.json /build/package.json
COPY ./package-lock.json /build/package-lock.json

RUN NODE_ENV=$NODE_ENV npm install
RUN NODE_ENV=$NODE_ENV npm initdb
RUN NODE_ENV=$NODE_ENV npm db migrate
CMD ["node", "index.js"]