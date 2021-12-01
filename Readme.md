# Desafío Clase 22

## Notas:

- La persistencia de los mensajes se realiza en archivo JSON
- El mensaje se envía del frontend hacia el backend, el cual lo almacena el JSON
- El array que manda el backend está normalizadonormalizado con normalizr, conteniendo una entidad de autores.
- El frontend posee el mismo esquema de normalización que el backend, para que este pueda desnormalizar y presentar la información.
- Se presenta el porcentaje de compresión tras la normalización, se actualiza en cada mensaje, puesto que crece la base de datos.
