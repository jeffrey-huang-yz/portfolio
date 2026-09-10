FROM node:20-alpine
WORKDIR /studio
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3333
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
