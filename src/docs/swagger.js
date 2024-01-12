import swaggerJsdoc from 'swagger-jsdoc';
/**
 * Configuración API /Información
 */
const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Api-Node',
        version: '1.0.0',
    }
    ,
    servers: [
        {
            url: "http://localhost:3000"
        }
    ]
}

/**
 * Opciones
 */

const optiones = {
    swaggerDefinition,
    apis: [
        "./routes/*.js"
    ]
}

const openApiConfiguration = swaggerJsdoc(optiones);
export default openApiConfiguration