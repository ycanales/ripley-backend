import express from "express";
import productsService from "./products.service";
import argon2 from "argon2";
import debug from "debug";

const log: debug.IDebugger = debug("app:products-controller");

// Controlador implementado como Singleton.
class ProductsController {
  private static instance: ProductsController;

  static getInstance(): ProductsController {
    if (!ProductsController.instance) {
      ProductsController.instance = new ProductsController();
    }
    return ProductsController.instance;
  }

  async listProducts(req: express.Request, res: express.Response) {
    const products = await productsService.list(100, 0);
    res.status(200).send(products);
  }

  async getProductById(req: express.Request, res: express.Response) {
    const product = await productsService.readById(req.params.productId);
    res.status(200).send(product);
  }

  async createProduct(req: express.Request, res: express.Response) {
    const productId = await productsService.create(req.body, req.file);
    res.status(201).send({ id: productId });
  }

  async patch(req: express.Request, res: express.Response) {
    log("body------", req.body);
    log(await productsService.patchById(req.body, req.file, +req.params.id));
    res.status(204).send(``);
  }

  async removeProduct(req: express.Request, res: express.Response) {
    log(await productsService.deleteById(req.params.productId));
    res.status(204).send(``);
  }
}

export default ProductsController.getInstance();
