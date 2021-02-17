import { DataTypes, Sequelize } from "sequelize";

export interface ProductDto {
  id: number;
  marca: string;
  imagen: string;
  nombre: string;
  descripcion: string;
  precio: number;
  precioDescuento: number;
}

export default function (sequelize: Sequelize) {
  sequelize.define("product", {
    // Sequelize agrega un campo id por defecto,
    // por lo que no hace falta definirlo nosotros.
    marca: DataTypes.STRING(100),
    imagen: DataTypes.STRING(500),
    nombre: DataTypes.STRING(300),
    descripcion: DataTypes.TEXT,
    precio: DataTypes.INTEGER,
    precioDescuento: DataTypes.INTEGER,
  });
}
