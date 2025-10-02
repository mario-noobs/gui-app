FROM node:20-alpine AS base

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN corepack enable pnpm

COPY . .

RUN pnpm install

ARG VITE_APP_API_URL=/gateway
ENV VITE_APP_API_URL=$VITE_APP_API_URL

RUN pnpm build

FROM nginx:1.24-alpine AS prod

COPY --from=base /app/dist /usr/share/nginx/html

EXPOSE 3000 

