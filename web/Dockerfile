FROM node:12.10 as webpack-build

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . ./
RUN npm run build

FROM nginx:1.19

COPY --from=webpack-build /app/dist/ /etc/nginx/html/
COPY nginx.conf /etc/nginx/nginx.conf
