import productsDao from "./products.dao";
import { CRUD } from "../common/crud.interface";
import { ProductDto } from "./products.model";

class ProductsService implements CRUD {
  private static instance: ProductsService;

  static getInstance(): ProductsService {
    if (!ProductsService.instance) {
      ProductsService.instance = new ProductsService();
    }
    return ProductsService.instance;
  }

  async create(resource: ProductDto, file: any) {
    return await productsDao.add(resource, file);
  }

  async deleteById(resourceId: string) {
    return await productsDao.removeById(resourceId);
  }

  // limit and page are ignored until we upgrade our DAO
  async list(search: string) {
    return await productsDao.all(search);
  }

  async patchById(resource: ProductDto, file: any, id: number) {
    return await productsDao.patchById(resource, file, id);
  }

  async readById(resourceId: string) {
    return await productsDao.getById(resourceId);
  }

  async getProductById(email: string) {
    return productsDao.getById(email);
  }
}

export default ProductsService.getInstance();
