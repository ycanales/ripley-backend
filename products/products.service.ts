import productsDao from './products.dao';
import {CRUD} from "../common/crud.interface";
import {ProductDto} from './products.model.dto';

class ProductsService implements CRUD {
    private static instance: ProductsService;

    static getInstance(): ProductsService {
        if (!ProductsService.instance) {
            ProductsService.instance = new ProductsService();
        }
        return ProductsService.instance;
    }

    async create(resource: ProductDto) {
        return await productsDao.addProduct(resource);
    }

    async deleteById(resourceId: string) {
        return await productsDao.removeProductById(resourceId);
    };

    // limit and page are ignored until we upgrade our DAO
    async list(limit: number, page: number) {
        return await productsDao.getProducts();
    };

    async patchById(resource: ProductDto) {
        return await productsDao.patchProductById(resource)
    };

    async readById(resourceId: string) {
        return await productsDao.getProductById(resourceId);
    };

    async updateById(resource: ProductDto) {
        return await productsDao.putProductById(resource);
    };

    async getProductById(email: string) {
        return productsDao.getProductById(email);
    }
}

export default ProductsService.getInstance();