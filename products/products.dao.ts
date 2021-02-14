import {ProductDto} from "./products.model.dto";
import shortid from "shortid";
import debug from "debug";
const log: debug.IDebugger = debug('app:products-dao');

// Singleton para tener una sola instancia del DAO.
class ProductsDao {
    private static instance: ProductsDao;
    products: Array<ProductDto> = [];

    constructor() {
        log('Creado ProductsDao');
    }

    static getInstance(): ProductsDao {
        if (!ProductsDao.instance) {
            ProductsDao.instance = new ProductsDao();
        }
        return ProductsDao.instance;
    }

    async addProduct(product: ProductDto) {
        product.id = shortid.generate();
        this.products.push(product);
        return product.id;
    }

    async getProducts() {
        return this.products;
    }

    async getProductById(productId: string) {
        return this.products.find((product: { id: string; }) => product.id === productId)
    }

    async putProductById(product: ProductDto) {
        const objIndex = this.products.findIndex((obj: { id: string; }) => obj.id === product.id);
        this.products.splice(objIndex, 1, product);
        return `${product.id} updated via PUT`;
    }

    async patchProductById(product: ProductDto) {
        const objIndex = this.products.findIndex((obj: { id: string; }) => obj.id === product.id);
        let currentProduct = this.products[objIndex];
        const allowedPatchFields = ['password', 'firstName', 'lastName', 'permissionLevel'];
        for (let field of allowedPatchFields) {
            if (field in product) {
                // @ts-ignore
                currentProduct[field] = product[field];
            }
        }
        this.products.splice(objIndex, 1, currentProduct);
        return `${product.id} patched`
    }

    async removeProductById(productId: string) {
        const objIndex = this.products.findIndex((obj: { id: string; }) => obj.id === productId);
        this.products.splice(objIndex, 1);
        return `${productId} removed`;
    }
}

export default ProductsDao.getInstance();