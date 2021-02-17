import { CommonRoutesConfig } from "../common/common.routes.config";
import ProductsController from "./products.controller";
import ProductsMiddleware from "./products.middleware";
import express from "express";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage });

export class ProductsRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, "ProductsRoutes");
  }

  configureRoutes(): express.Application {
    this.app
      .route("/products")
      .get(ProductsController.listProducts)
      .post(upload.single("imagen"), ProductsController.createProduct);

    this.app
      .route("/products/:productId")
      .get(ProductsController.getProductById)
      .delete(ProductsController.removeProduct);

    // Hay problemas en recibir el payload como PATCH
    // y en formato form-data con archivos.
    this.app.post("/products/:id/patch", [
      upload.single("imagen"),
      ProductsMiddleware.validatePatchId,
      ProductsController.patch,
    ]);

    return this.app;
  }
}
