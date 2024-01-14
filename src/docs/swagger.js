import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Configuración API /Información
 */
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Node MongoDB API',
            version: '1.0.0',
        },
        servers: [
            {
                url: "http://localhost:3000"
            }
        ],
    },
    apis: [path.join(__dirname, '../routers/*.js')],  // Corregir la ruta de los routers
}

const swaggerSpec = swaggerJsdoc(swaggerOptions);
export default swaggerSpec;
