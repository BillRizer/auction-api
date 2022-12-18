FROM node:16-alpine As dev

WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn

COPY . .


FROM node:16-alpine as prod

ENV NODE_ENV production

WORKDIR /usr/src/app

COPY package*.json ./

# RUN npm install --only=production
RUN npm ci --only=production && npm cache clean --force

COPY . .

COPY --from=dev /usr/src/app/dist ./dist

CMD ["node", "dist/main"]

