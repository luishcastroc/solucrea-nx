# Solucrea - Aplicación

Proyecto de aplicación financiera para manejo de créditos

## Servidor de Desarrollo

En la terminal correr el comando `nx serve api` y `nx serve solucre`, el primero correra el backend que maneja la base de datos y el segundo correrá la interfaz.

Run in terminal `nx serve api` y `nx serve solucre`, the first one will run the backend and second one will run the front-end which displays the user interface

## Build y Deployment

Para hacer el "Deployment" a producción correr `nx build api --prod` y `nx build solucrea --prod` estos generaran sus respectivos directorios en `dist/`

Posteriormente se debera iniciar sesion en AWS usando SSH `ssh -i "solucrea-backend.pem" ec2-user@ec2-18-188-146-210.us-east-2.compute.amazonaws.com` esto con el certificado SSL proporcionado (archivo.pem).

En la consola de AWS `rm -rf /opt/front-end/*` y `rm -rf /opt/api/*` para borrar el contenido de los directorios.

copiar el contenido de dist a AWS utilizando el comando:

`scp -i "solucrea-backend.pem" -r <folder raiz del proyecto>/dist/apps/solucrea/* ec2-user@ec2-18-188-146-210.us-east-2.compute.amazonaws.com:/opt/front-end` para el front end.

`scp -i "solucrea-backend.pem" -r <folder raiz del proyecto>/dist/apps/api/* ec2-user@ec2-18-188-146-210.us-east-2.compute.amazonaws.com:/opt/api` para el backend.

`scp -i "solucrea-backend.pem" -r <folder raiz del proyecto>/prisma/* ec2-user@ec2-18-188-146-210.us-east-2.compute.amazonaws.com:/opt/api` para el cliente PRisma (este se encarga del manejo de la base de datos junto con el backend).

despues se debera detener la instancia de PM2 para reiniciarla usando `pm2 delete main`.

despues debemos hacer el deployment de prisma iremos al directorio de la api `cd opt/api` y haremos `npm i --legacy-peer-deps` posteriormente generaremos el cliente Prisma usando el comando `npx prisma generate` despues iniciaremos la instancia de PM2 usando `pm2 start main.js`.

debemos poder navegar por la aplicacion usando [http://ec2-18-188-146-210.us-east-2.compute.amazonaws.com/sign-in] (http://ec2-18-188-146-210.us-east-2.compute.amazonaws.com/sign-in)
