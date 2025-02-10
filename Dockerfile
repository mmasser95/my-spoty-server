# Usar la imagen base de Node.js con Alpine para menor tamaño
FROM node:20-alpine

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Instalar dependencias del sistema necesarias para compilar algunas dependencias de Node.js
RUN apk add --no-cache bash curl libc6-compat python3 make g++ 

# Copiar archivos de configuración y dependencias primero para aprovechar la caché de Docker
COPY package.json package-lock.json ./

# Instalar dependencias en un directorio separado para evitar permisos de root
RUN npm ci --omit=dev

# Copiar el código de la aplicación después de instalar las dependencias
COPY . .

# Exponer el puerto en el que se ejecuta AdonisJS
EXPOSE 3333

# Comando de inicio
CMD ["node", "server.js"]
