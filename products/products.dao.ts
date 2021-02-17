import AWS from "aws-sdk";
import nanoid from "nanoid";
import http from "http";

import secrets from "../common/secrets";
import s from "../common/sequelize";
import debug from "debug";
import { ProductDto } from "./products.model";
const log: debug.IDebugger = debug("app:products-dao");

// Singleton para tener una sola instancia del DAO.
class ProductsDao {
  private static instance: ProductsDao;
  private static s3: AWS.S3;

  constructor() {
    log("Creado ProductsDao");
  }

  static getInstance(): ProductsDao {
    if (!ProductsDao.instance) {
      ProductsDao.instance = new ProductsDao();

      ProductsDao.s3 = new AWS.S3({
        accessKeyId: secrets.accessKeyId,
        secretAccessKey: secrets.secretAccessKey,
        endpoint: "http://s3.sirv.com",
        httpOptions: {
          // @ts-ignore
          agent: new http.Agent({ rejectUnauthorized: false }),
        },
      });
    }
    return ProductsDao.instance;
  }

  async add(product: ProductDto, file: any) {
    log("------add ", product);
    try {
      log("multer file", file);

      if (file && file.buffer) {
        const split = file.originalname.split(".");
        const extension = split[split.length - 1] ?? "";
        const stored = await ProductsDao.s3
          .upload({
            Bucket: "dratiora",
            Key: `${nanoid()}.${extension}`,
            Body: file.buffer,
          })
          .promise();
        product.imagen = stored.Location.replace(".s3", "");
        log("Uploaded to", product.imagen);
      }
      const p: any = await s.models.product.create(product);
      return p.id;
    } catch (err) {
      log(err);
    }
  }

  async all() {
    const products = await s.models.product.findAll();
    return products;
  }

  async getById(productId: string) {
    return await s.models.product.findByPk(productId);
  }

  async patchById(product: ProductDto, file: any, id: number) {
    log("- - - - -patch this", product);
    await s.models.product.update(product, {
      where: { id },
    });
    return `${id} patched`;
  }

  async removeById(productId: string) {
    await s.models.product.destroy({
      where: {
        id: productId,
      },
    });
    return `${productId} removed`;
  }
}

export default ProductsDao.getInstance();
