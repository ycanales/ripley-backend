import debug from 'debug';
import sequelize from './common/sequelize';
import app from './common/express';
const PORT = 3000;

const debugLog: debug.IDebugger = debug('app')

async function assertDatabaseConnectionOk() {
    debugLog('Comprobando conexion a base de datos');
    try {
        await sequelize.authenticate();
        debugLog('Conexion exitosa');
    } catch (error) {
        debugLog('Error de conexion');
        debugLog(error.message);
        process.exit(1);
    }
}

async function init() {
    await assertDatabaseConnectionOk();

    // Creamos las tablas desde cero. En producción debemos usar migraciones.
    sequelize.sync({ force: true}).then(() => debugLog('Sequelize sync OK'));

    app.listen(PORT, () => {
        debugLog(`Server corriendo en http://localhost:${PORT}`);
    });
}

init();