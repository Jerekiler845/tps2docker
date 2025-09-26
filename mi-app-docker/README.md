# TP2 - Aplicación Node.js + PostgreSQL con Docker

Este proyecto muestra cómo contenerizar una aplicación Node.js con Express y conectarla a bases de datos PostgreSQL en entornos QA y PROD utilizando **Docker** y **Docker Compose**.

---

## 📦 Requisitos previos

- [Docker](https://docs.docker.com/get-docker/)  
- [Docker Compose](https://docs.docker.com/compose/install/)  
- Git (para clonar el repositorio)  

---

## 🔧 Clonar el repositorio

```bash
git clone https://github.com/Jerekiler845/tps2docker.git
cd tps2docker/mi-app-docker

Para construir manualmente la imagen de la app:

docker build -t mi-app:dev .
Ejecución con Docker Compose

Levantar todos los servicios en segundo plano:

docker-compose up -d

Forzar reconstrucción de imágenes:

docker-compose up -d --build

Apagar todo:

docker-compose down

Acceso a la aplicación

QA: http://localhost:3000

PROD: http://localhost:3001

Ver logs:
docker logs mi-app-docker-app_qa-1
docker logs mi-app-docker-app_prod-1

Verificación de funcionamiento

Acceder a la app vía navegador o curl.

Insertar datos en la DB:

INSERT INTO tabla_ejemplo(nombre) VALUES ('TEST_PERSISTENCIA');

Reiniciar contenedores:

docker-compose down
docker-compose up -d

Verificar que los datos siguen → confirma que los volúmenes funcionan.