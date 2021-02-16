import s from '../common/sequelize';
import debug from "debug";
import {ProductDto} from "./products.model";
const log: debug.IDebugger = debug('app:products-dao');

// Singleton para tener una sola instancia del DAO.
class ProductsDao {
    private static instance: ProductsDao;

    constructor() {
        log('Creado ProductsDao');
    }

    static getInstance(): ProductsDao {
        if (!ProductsDao.instance) {
            ProductsDao.instance = new ProductsDao();
        }
        return ProductsDao.instance;
    }

    async add(product: ProductDto) {
        const p: any = await s.models.product.create(product);
        return p.id;
    }

    async all() {
        const products = await s.models.product.findAll();
        return products;
    }

    async getById(productId: string) {
        return await s.models.product.findByPk(productId);
    }

    async patchById(product: ProductDto) {
        await s.models.product.update(product, {
            where: {
                id: product.id
            }
        });
        return `${product.id} patched`
    }

    async removeById(productId: string) {
        await s.models.product.destroy({
            where: {
                id: productId
            }
        });
        return `${productId} removed`;
    }
}

export default ProductsDao.getInstance();