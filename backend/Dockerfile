
FROM node:alpine as build
WORKDIR /app
COPY package*.json .
RUN mpm install
COPY . .
RUN npm run build

FROM node:alpine as production
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/dist ./dist
COPY --from=build /app/emails ./emails
COPY package*.json ./
EXPOSE 3001
CMD [ "node", "dist/server.js" ]