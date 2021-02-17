import AWS from "aws-sdk";
import nanoid from "nanoid";
import http from "http";
import { Op } from "sequelize";

import secrets from "../common/secrets";
import s from "../common/sequelize";
import isPalindrome from "../common/isPalindrome";
import debug from "debug";
import { ProductDto } from "./products.model";

const log: debug.IDebugger = debug("app:products-dao");
const BUCKET: string = "dratiora";

function getUploadParams(file: any) {
  const split = file.originalname.split(".");
  const extension = split[split.length - 1] ?? "";
  return {
    Bucket: BUCKET,
    Key: `${nanoid()}.${extension}`,
    Body: file.buffer,
  };
}

// Singleton para tener una sola instancia del DAO.
class ProductsDao {
  private static instance: ProductsDao;
  private static s3: AWS.S3;

  constructor() {
    log("Creado ProductsDao");
  }

  static async upload(file: any, product: ProductDto) {
    if (file && file.buffer) {
      const stored = await ProductsDao.s3
        .upload(getUploadParams(file))
        .promise();
      // Corregimos URL, esto es especifico del CDN de imágenes.
      product.imagen = stored.Location.replace(".s3", "");
      log("Uploaded to", product.imagen);
    }
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
    try {
      await ProductsDao.upload(file, product);
      const p: any = await s.models.product.create(product);
      return p.id;
    } catch (err) {
      log(err);
    }
  }

  async all(search: string) {
    let products = [];
    // Busqueda por ID exacto.
    if (search && !isNaN(parseInt(search, 10))) {
      log("Busqueda por ID", search);
      const product = await s.models.product.findByPk(+search);
      if (product) {
        products.push(product);
      }
    } else if (search) {
      // Busqueda por marca y descripcion
      log("Busqueda:", search);
      products = await s.models.product.findAll({
        where: {
          [Op.or]: [
            {
              nombre: {
                [Op.substring]: search,
              },
            },
            {
              marca: {
                [Op.substring]: search,
              },
            },
            {
              descripcion: {
                [Op.substring]: search,
              },
            },
          ],
        },
      });
    } else {
      products = await s.models.product.findAll();
    }

    // Aplicamos descuento del 20%.
    if (search && search.length > 1 && isPalindrome(search)) {
      products.forEach((product) => {
        // @ts-ignore
        product.precioDescuento = Math.floor(product.precio * 0.8);
      });
    }

    return products;
  }

  async getById(productId: string) {
    return await s.models.product.findByPk(productId);
  }

  async patchById(product: ProductDto, file: any, id: number) {
    try {
      await ProductsDao.upload(file, product);
      await s.models.product.update(product, {
        where: { id },
      });
    } catch (err) {
      log(err);
    }

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
