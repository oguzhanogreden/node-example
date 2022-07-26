FROM node

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm ci

COPY tsconfig.json .

COPY src ./src

RUN npx tsc

CMD npm start