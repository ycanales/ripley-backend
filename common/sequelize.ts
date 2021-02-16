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
