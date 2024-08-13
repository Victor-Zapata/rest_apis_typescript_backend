
//aqui vamos a colocar la informacion general de nuestra API
import swaggerJSDoc from "swagger-jsdoc";
import { SwaggerUiOptions } from "swagger-ui-express";

const options: swaggerJSDoc.Options = {
    swaggerDefinition: {
        openapi: '3.0.2',
        tags: [{
            name: 'Products',
            description: 'API operations related to products'
        }],
        info: {
            title: 'REST API Node.js / Express / Typescript',
            version: '1.0.0',
            description: 'API docs for products'
        }
    },
    //aqui ponemos donde van a estar los endpoints que queremos documentar
    apis: ['./src/router.ts']
}

const swaggerSpec = swaggerJSDoc(options)
const swaggerUiOptions: SwaggerUiOptions = {
    customCss: `
    .topbar-wrapper .link {
        content: url('https://i.pinimg.com/564x/93/3a/3e/933a3e205882d37a70a0559fd5aaaf43.jpg');
        height: 120px;
        width: auto;
    }
    .swagger-ui .topbar a {
        max-width:150px;
        border-radius: 50px
    }
    `,
    customSiteTitle: `Mi primera documentación de un API`
}

export {
    swaggerUiOptions
}
export default swaggerSpec
