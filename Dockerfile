FROM node:18-alpine
WORKDIR /usr
COPY package.json ./
COPY tsconfig.json ./
COPY src ./src
RUN ls -a
RUN npm install
RUN npm run build

FROM node:18-slim
WORKDIR /usr
COPY package.json .
COPY --from=0 /usr/dist .
COPY prisma/schema.prisma prisma/schema.prisma
RUN apt-get update
RUN apt-get install -y openssl
RUN npm install --only=production
RUN npx prisma generate
RUN npm install pm2 -g
EXPOSE 8080
CMD ["pm2-runtime", "start", "./src/index.js"]
