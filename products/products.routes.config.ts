import { CommonRoutesConfig } from "../common/common.routes.config";
import express from "express";

export class ProductsRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'ProductsRoutes');
    }

    configureRoutes(): express.Application {
        this.app.route('/products')
            .get((req: express.Request, res: express.Response) => {
                res.status(200).send('List of products')
            })
            .post((req: express.Request, res: express.Response) => {
                res.status(200).send('Post to products')
            });

        this.app.route('/products/:productId')
            .all((req: express.Request, res: express.Response, next: express.NextFunction) => {
                next();
            })
            .get((req: express.Request, res: express.Response) => {
                res.status(200).send(`GET requested for id ${req.params.productId}`);
            })

        return this.app;
    }
}