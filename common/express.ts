import express from "express";
import http from "http";
import {CommonRoutesConfig} from "./common.routes.config";
import debug from "debug";
import * as bodyparser from "body-parser";
import cors from "cors";
import * as expressWinston from "express-winston";
import * as winston from "winston";
import {ProductsRoutes} from "../products/products.routes";

const debugLog: debug.IDebugger = debug('app')

const app: express.Application = express();
const server: http.Server = http.createServer(app);
const port: Number = 3000;
const routes: Array<CommonRoutesConfig> = [];

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

export default app;