# decisiones.md

## 1. Elección de la aplicación y tecnología utilizada
Se eligió una **aplicación web simple en Node.js** con Express para este práctico, ya que:
- Node.js permite construir aplicaciones ligeras y de rápido despliegue.
- Express es un framework sencillo que facilita levantar un servidor web y exponer endpoints.
- Permite demostrar de manera clara la integración con Docker y bases de datos.
- La aplicación incluye un directorio `src` con un archivo `index.js` que arranca el servidor.

## 2. Elección de la imagen base y justificación
- Se utilizó la imagen `node:18-alpine`.
- Justificación:
  - Alpine es una versión **ligera** de Linux, lo que reduce el tamaño final de la imagen.
  - Node 18 es la versión LTS más reciente, asegurando compatibilidad con dependencias modernas.
  - La combinación permite instalar dependencias rápidamente y construir imágenes optimizadas para producción.

## 3. Elección de base de datos y justificación
- Se eligió **PostgreSQL 15-alpine** como base de datos.
- Justificación:
  - PostgreSQL es robusta, ampliamente utilizada y soporta transacciones complejas.
  - La versión alpine mantiene la imagen ligera.
  - Es ideal para mostrar persistencia de datos mediante volúmenes y trabajar en entornos QA y PROD distintos.

## 4. Estructura y justificación del Dockerfile
Dockerfile utilizado:

```dockerfile
FROM node:18-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --production
COPY . .
CMD ["node", "src/index.js"]

## 5. Configuración de QA y PROD (variables de entorno)
Se crearon dos archivos de entorno: .env.qa y .env.prod.

Variables de ejemplo:

DB_HOST=db_qa
DB_USER=postgres
DB_PASS=12345
DB_NAME=miapp
PORT=3000

En PROD se cambian DB_HOST=db_prod y PORT=3000 (mapeado a 3001 externamente).

Esto permite usar la misma imagen en QA y PROD, solo cambiando variables, sin reconstruir.

6. Estrategia de persistencia de datos (volúmenes)

Para las bases de datos se montaron volúmenes:

volumes:
  db_qa_data:
  db_prod_data:


Permite que los datos se mantengan entre reinicios o recreaciones de contenedores.

Garantiza que la información de la aplicación no se pierda y que QA y PROD sean independientes.

7. Estrategia de versionado y publicación

Imagen etiquetada como: miusuario/mi-app:dev para desarrollo y miusuario/mi-app:v1.0 para versión estable.

Estrategia:

dev: para pruebas y cambios frecuentes.

v1.0: versión estable, lista para despliegue.

Publicación en Docker Hub asegura que cualquier miembro del equipo o entorno pueda levantar la misma versión.

8. Evidencia de funcionamiento

Aplicación corriendo en ambos entornos

tp2-app_qa-1 → puerto 3000

tp2-app_prod-1 → puerto 3001

Comprobado con docker ps y navegador.

Conexión exitosa a la base de datos

Verificado mediante logs de la app al iniciar y realizar operaciones de prueba (docker logs).

Datos persistiendo entre reinicios

Se reiniciaron contenedores y los datos de prueba permanecieron (docker-compose down && docker-compose up -d).

Problemas y soluciones

Error Cannot find module '/usr/src/app/src/index.js': causado por no copiar correctamente la carpeta src → solucionado asegurando que COPY . . incluya src.

Contenedores de app saliendo inmediatamente: causado por variables de entorno incorrectas o conexión a DB → solucionado configurando .env.qa y .env.prod con los nombres de los servicios de la DB (db_qa y db_prod).


prueba de persistencia 

miapp=# INSERT INTO tabla_ejemplo(nombre) VALUES ('TEST_PERSISTENCIA');
INSERT 0 1
miapp=# SELECT * FROM tabla_ejemplo;
 id |      nombre
----+-------------------
  1 | TEST_PERSISTENCIA
(1 row)

miapp=#
miapp=# exit

C:\Users\usuario dos\OneDrive\Escritorio\quinto año\ing soft 3\tp2\mi-app-docker>docker-compose down
time="2025-09-05T16:50:32-03:00" level=warning msg="C:\\Users\\usuario dos\\OneDrive\\Escritorio\\quinto año\\ing soft 3\\tp2\\mi-app-docker\\docker-compose.yml: the attribute `version` is obsolete, it will be ignored, please remove it to avoid potential confusion"
[+] Running 5/5
 ✔ Container mi-app-docker-app_prod-1  Removed                    10.8s
 ✔ Container mi-app-docker-app_qa-1    Removed                    10.7s
 ✔ Container mi-app-docker-db_qa-1     Removed                     1.3s
 ✔ Container mi-app-docker-db_prod-1   Removed                     0.7s
 ✔ Network mi-app-docker_default       Removed                     0.3s

C:\Users\usuario dos\OneDrive\Escritorio\quinto año\ing soft 3\tp2\mi-app-docker>docker-compose up -d
time="2025-09-05T16:50:47-03:00" level=warning msg="C:\\Users\\usuario dos\\OneDrive\\Escritorio\\quinto año\\ing soft 3\\tp2\\mi-app-docker\\docker-compose.yml: the attribute `version` is obsolete, it will be ignored, please remove it to avoid potential confusion"
[+] Running 5/5
 ✔ Network mi-app-docker_default       Created                     0.1s
 ✔ Container mi-app-docker-db_qa-1     Healthy                    11.7s
 ✔ Container mi-app-docker-db_prod-1   Healthy                    11.7s
 ✔ Container mi-app-docker-app_qa-1    Started                    11.9s
 ✔ Container mi-app-docker-app_prod-1  Started                    11.9s

C:\Users\usuario dos\OneDrive\Escritorio\quinto año\ing soft 3\tp2\mi-app-docker>

C:\Users\usuario dos\OneDrive\Escritorio\quinto año\ing soft 3\tp2\mi-app-docker>docker exec -it mi-app-docker-db_qa-1 psql -U postgres -d miapp
SELECT * FROM tabla_ejemplo;
psql (15.14)
Type "help" for help.

miapp=# SELECT * FROM tabla_ejemplo;
 id |      nombre
----+-------------------
  1 | TEST_PERSISTENCIA
(1 row)

miapp=#
miapp=# exit
