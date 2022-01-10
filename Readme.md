# Desafío Clase 30

## Consigna: Modo cluster y servidor

Tomando con base el proyecto que vamos realizando, agregar un parámetro más en la ruta de comando que permita ejecutar al servidor en modo fork o cluster. Dicho parámetro será 'FORK' en el primer caso y 'CLUSTER' en el segundo, y de no pasarlo, el servidor iniciará en modo fork.

- Agregar en la vista info (`http://localhost:8080/info/`), el número de procesadores presentes en el servidor.
- Ejecutar el servidor (modos FORK y CLUSTER) con nodemon verificando el número de procesos tomados por node.
- Ejecutar el servidor (con los parámetros adecuados) utilizando Forever, verificando su correcta operación. Listar los procesos por Forever y por sistema operativo.

### Resolucion

Instalar dependencias

```
npm install
```

EL servidor se ejecuta desde el archivo `./inmdex.js`. Se puede cambiar el puerto mediante el argumento `-p` y el modo (cluster o fork) mediante el argumento `-m`. Por defecto, el puerto es 8080 y el modo, fork. Ejemplos:

### Con node:

```
node index.js
node index.js -p 8082
node index -p 8082 -m cluster
```

Procesos modo fork:

![Modo fork con node](./images/node-fork.png "Modo fork con node")

Procesos modo cluster:

![Modo cluster con node](./images/node-fork.png "Modo cluster con node")

### Con nodemon (no incluido en el package.json):

```
nodemon index.js
nodemon index.js -p 8082
nodemon index -p 8082 -m cluster
```

Procesos modo fork:

![Modo fork con nodemon](./images/nodemon-fork.png "Modo fork con nodemon")

Procesos modo cluster:

![Modo cluster con nodemon](./images/nodemon-fork.png "Modo cluster con nodemon")

### Con forever (no incluido en el package.json):

```
forever start -w index.js
forever start -w index.js -p 8082
forever start -w index.js -m cluster
```

Para detener: `forever stop index.js`

Procesos con modo fork:

![Modo fork con forever](./images/forever-list.png "Modo fork con forever")
![Modo fork con forever, procesos OS](./images/forever-os.png "Modo fork con forever, procesos OS")

Procesos con modo cluster:

![Modo cluster con forever](./images/forever-list-cluster.png "Modo cluster con forever")
![Modo cluster con forever, procesos OS](./images/forever-os-cluster.png "Modo cluster con forever, procesos OS")

### Con PM2 (no incluido en el package.json):

```
pm2 start index.js -w
pm2 start index.js --name="cluster-pm2"  -w -i max
```

Procesos con modo fork:

![Modo fork con pm2](./images/pm2-list.png "Modo fork con pm2")
![Modo fork con pm2, procesos OS](./images/pm2-os.png "Modo fork con pm2, procesos OS")

Procesos con modo cluster:

![Modo cluster con pm2](./images/pm2-list-cluster.png "Modo cluster con pm2")
![Modo cluster con pm2, procesos OS](./images/pm2-os-cluster.png "Modo cluster con pm2, procesos OS")
