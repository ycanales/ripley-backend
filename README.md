# Desafío Técnico Ripley - Backend'

Este repositorio implementa los requerimientos para el backend del desafío técnico.
La base de datos utilizada es Sqlite la cual se accede mediante el ORM Sequelize. La base de datos vive en memoria por lo que de reiniciarse la aplicación se perderán las modificaciones.

## Cómo correr

1. Instalar dependencias con `npm install`
2. Agregar archivo `common/secrets.ts` con las llaves para el bucket de S3 para subida de imágenes. 
3. Correr de manera local con `npm run debug`

Para correr en producción he optado por subirlo a una VPS, usar Nginx como proxy reverso y correr la aplicación NodeJS con [PM2](https://pm2.keymetrics.io/).

## Librerías

Me he apoyado en diversas librerías para el desarrollo de la solución:

- `Express`: para estructurar la aplicación web.
- `nanoid`: creación de identificadores únicos, usados en este caso para los nombres de imágenes subidas.
- `aws-sdk`: para subir las imágenes a S3.
- `sequelize`: ORM para bases de datos SQL.