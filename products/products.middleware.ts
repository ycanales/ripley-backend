import express from 'express';
import productService from './products.service';

class ProductsMiddleware {
    private static instance: ProductsMiddleware;

    static getInstance() {
        if (!ProductsMiddleware.instance) {
            ProductsMiddleware.instance = new ProductsMiddleware();
        }
        return ProductsMiddleware.instance;
    }

    async validateRequiredProductFields(req: express.Request, res: express.Response, next: express.NextFunction) {
        if (req.body && req.body.id) {
            next();
        } else {
            res.status(400).send({error: 'Falta campo id'});
        }
    }

    async validateProductExists(req: express.Request, res: express.Response, next: express.NextFunction) {
        const product = await productService.getProductById(req.body.id);
        if (product) {
            next();
        } else {
            res.status(404).send({error: 'ID de producto invalido'})
        }
    }

    async validatePatchId(req: express.Request, res: express.Response, next: express.NextFunction) {
        if (req.body.id) {
            await ProductsMiddleware.getInstance().validateProductExists(req, res, next);
        } else {
            next();
        }
    }
}

export default ProductsMiddleware.getInstance();