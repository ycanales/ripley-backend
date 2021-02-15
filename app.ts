import express from 'express';
import * as http from 'http';
import * as bodyparser from 'body-parser';

import * as winston from 'winston';
import * as expressWinston from 'express-winston';
import cors from 'cors';
import {Sequelize} from 'sequelize';
import {CommonRoutesConfig} from "./common/common.routes.config";
import {ProductsRoutes} from "./products/products.routes.config";
import debug from 'debug';

const app: express.Application = express();
const server: http.Server = http.createServer(app);
const port: Number = 3000;
const routes: Array<CommonRoutesConfig> = [];
const debugLog: debug.IDebugger = debug('app')

// Iniciar conexión con base de datos
const sequelize = new Sequelize('sqlite::memory:');
sequelize.authenticate()
    .then(() => debugLog('Conexion exitosa'))
    .catch((error) => debugLog('Error al conectar a base de datos', error));

// const Product = sequelize.define('Product', {
//
// })

// Parsear requests como JSON
app.use(bodyparser.json());

// Permitir requests cross-origin
app.use(cors());

// Logging
app.use(expressWinston.logger({
    transports: [
        new winston.transports.Console()
    ],
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json()
    )
}));


// Agregar routes de modulo products
routes.push(new ProductsRoutes(app));

// Configurar winston para logging de errores
app.use(expressWinston.errorLogger({
    transports: [ new winston.transports.Console()],
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json()
    )
}));

app.get('/', (req: express.Request, res: express.Response) => {
    res.status(200).send('hola mundo')
})

server.listen(port, () => {
    debugLog(`Server corriendo en http://localhost:${port}`)
    routes.forEach((route: CommonRoutesConfig) => {
        debugLog(`Ruta configarada para ${route.getName()}`);
    });
});