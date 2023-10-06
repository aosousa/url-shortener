FROM node:18-alpine

WORKDIR /server
COPY package.json .
COPY prisma ./prisma/
RUN npm install
COPY . .
CMD ["npm", "run", "start:migrate"]

