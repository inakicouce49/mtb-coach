FROM node:18

WORKDIR /app

# Copia los archivos de dependencias
COPY package*.json ./

# Instala las dependencias dentro del contenedor
RUN npm install

# Copia el resto del código
COPY . .

# Expone el puerto 3000
EXPOSE 3000

# Comando para iniciar la app
CMD ["npm", "start"]
