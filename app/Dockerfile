FROM node:16-alpine3.15

WORKDIR /app

COPY package*.json /app
RUN npm install

COPY . /app/

ENV DATABASE_URL=postgresql://postgres:postgres@postgres:5432/ucits?schema=public&connect_timeout=60

RUN npx prisma generate

EXPOSE 3000
CMD ["npm", "run", "dev"]