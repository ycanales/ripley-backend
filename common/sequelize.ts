import { Sequelize } from "sequelize";
import productModelDefiner from '../products/products.model';

const sequelize = new Sequelize('sqlite::memory:');

// Aqui agregaríamos todas las definiciones de modelos,
// ahora solo tenemos el de Product.
const modelDefiners = [
    productModelDefiner
];

// Inicializamos los modelos
for (const modelDefiner of modelDefiners) {
    modelDefiner(sequelize);
}

export default sequelize;

export async function dataSeed() {
    // Creamos las tablas desde cero. En producción debemos usar migraciones.
    await sequelize.sync({ force: true})
    await sequelize.models.product.bulkCreate([
        { marca: 'Zico', imagen: '', nombre: 'Chalas', descripcion: 'Calzado premium.', precio: 12990},
        { marca: 'Mota', imagen: '', nombre: 'Calzoncillos', descripcion: 'Ropa interior', precio: 9990},
        { marca: 'Mota', imagen: '', nombre: 'Calcetines', descripcion: '99% algodon', precio: 3990},
        { marca: 'Don Tito', imagen: '', nombre: 'Calcetines', descripcion: '100% algodon', precio: 2990},
        { marca: 'Rey de la Van', imagen: '', nombre: 'Anteojos', descripcion: 'Original sunglasses', precio: 39990}
    ]);
}
