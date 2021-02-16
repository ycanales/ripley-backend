import { CommonRoutesConfig } from "../common/common.routes.config";
import ProductsController from './products.controller';
import ProductsMiddleware from './products.middleware';
import express from "express";

export class ProductsRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'ProductsRoutes');
    }

    configureRoutes(): express.Application {
        this.app.route('/products')
            .get(ProductsController.listProducts)
            .post(ProductsController.createProduct);

        this.app.route('/products/:productId')
            .get(ProductsController.getProductById)
            .delete(ProductsController.removeProduct);

        this.app.patch('/products/:productId', [
            ProductsMiddleware.validatePatchId,
            ProductsController.patch
        ])

        return this.app;
    }
}