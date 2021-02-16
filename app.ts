import debug from 'debug';
import sequelize, {dataSeed} from './common/sequelize';
import app from './common/express';
const PORT = 3001;

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
    await dataSeed();

    app.listen(PORT, () => {
        debugLog(`Server corriendo en http://localhost:${PORT}`);
    });
}

init();