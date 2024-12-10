FROM node:22.11.0

WORKDIR /usr/src/app

# Actualiza el sistema e instala dependencias necesarias (por si acaso se necesitan otras)
RUN apt-get update && apt-get install -y netcat-openbsd

RUN curl -o /usr/local/bin/wait-for-it https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh && chmod +x /usr/local/bin/wait-for-it


# Copiar los archivos de package.json y package-lock.json
COPY package*.json ./

# Instalar las dependencias de Node.js
RUN npm install

# Copiar el resto de los archivos de la aplicación
COPY . .

# Exponer el puerto donde la aplicación escuchará
EXPOSE 3004

# Iniciar el servicio directamente sin esperar explícitamente a la base de datos
CMD ["node", "www"]