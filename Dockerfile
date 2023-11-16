FROM node

WORKDIR /transcendance

COPY package.json ./

RUN npm install --legacy-peer-deps

RUN npm install ajv@latest --legacy-peer-deps

RUN npm dedupe --force

COPY . .

EXPOSE 3000

ENTRYPOINT npm run start

#RUN npm i --legacy-peer-deps

#EXPOSE 3000

#CMD npm --prefix /transcendance i --legacy-peer-deps && npm --prefix /transcendance run start
