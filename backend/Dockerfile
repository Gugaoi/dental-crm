FROM node:20-alpine

# Required by Prisma on Alpine
RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY prisma ./prisma
RUN npx prisma generate

COPY src ./src

EXPOSE 3001

CMD ["sh", "-c", "npx prisma migrate deploy && node src/app.js"]
