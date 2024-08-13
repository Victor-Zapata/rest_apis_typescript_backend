import { Router } from "express"
import { createProduct, deleteProduct, getProductById, getProducts, updateAvaiability, updateProduct } from "./handlers/product"
import { body, param } from "express-validator"
import { handleInputErrors } from "./middleware"

const router = Router()

//aca defino los atributos de la schema para documentar mi API
/**
 * @swagger
 * components:
 *      schemas:
 *         Product:
 *              type: object
 *              properties: 
 *                  id: 
 *                      type: integer
 *                      description: The Product ID
 *                      example: 1
 *                  name: 
 *                      type: string
 *                      description: The Product Name
 *                      example: Monitor Curvo
 *                  price: 
 *                      type: number
 *                      description: The Product Price
 *                      example: 450
 *                  avaiability:
 *                      type: boolean
 *                      description: The Product Avaiability
 *                      example: true
 */

/**
 * @swagger
 * /api/products:
 *      get:
 *          summary: get a product list
 *          tags: 
 *              - Products
 *          description: Return a list of products
 *          responses: 
 *               200:
 *                  description: Successful response
 *                  content: 
 *                      application/json:
 *                           schema:
 *                              type: array
 *                              items:
 *                                  $ref: '#/components/schemas/Product'
 */
router.get('/', getProducts)

//en la documentacion del siguiente endpoint puedo especificar que el id es una variable de 
//dos modos...:id...{id}
/**
 * @swagger
 * /api/products/{id}:
 *      get:
 *          summary: get a product by ID
 *          tags:
 *              - Products
 *          description: Return a product based on its unique ID
 *          parameters:
 *            - in: path
 *              name: id
 *              description: id of the product
 *              required: true
 *              schema: 
 *                  type: integer
 *          responses: 
 *               200:
 *                  description: Successful response
 *                  content: 
 *                      application/json:
 *                           schema:
 *                               $ref: '#/components/schemas/Product'
 *               404: 
 *                  description: Product not found
 *               400:
 *                  description: Bad request - invalid ID
 */
router.get('/:id',
    param('id')
        .isInt().withMessage('ID no válido'),
    handleInputErrors,
    getProductById)

/**
 * @swagger
 * /api/products:
 *      post:
 *          summary: create a new product
 *          tags:
 *              - Products
 *          description: Return a new record in the db 
 *          requestBody: 
 *                required: true
 *                content: 
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties: 
 *                                  name:
 *                                      type: string
 *                                      example: "Monitor Curvo"
 *                                  price: 
 *                                      type: number
 *                                      example: 399
 *          responses:
 *               201:
 *                  description: Product updated successfully 
 *                  content: 
 *                          application/json:
 *                                schema:
 *                                  $ref: '#/components/schemas/Product' 
 *               400:
 *                  description: Bad request - invalid input data
 */

router.post('/',
    //validación
    body('name')
        .notEmpty().withMessage('El nombre del producto no puede estar vacío'),
    body('price')
        .notEmpty().withMessage('El precio del producto no puede estar vacío')
        .isNumeric().withMessage('El precio debe ser un número')
        .custom(value => value > 0).withMessage('El precio debe ser mayor a cero'),
    handleInputErrors,
    createProduct
)

/**
 * @swagger 
 * /api/products/{id}:
 *      put:
 *          summary: Update a existing product in the db with user input
 *          tags:
 *              - Products
 *          description: return de updated product
 *          parameters:
 *            - in: path
 *              name: id
 *              description: id of the product
 *              required: true
 *              schema: 
 *                  type: integer
 *          requestBody: 
 *                required: true
 *                content: 
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties: 
 *                                  name:
 *                                      type: string
 *                                      example: "Monitor Curvo"
 *                                  price: 
 *                                      type: number
 *                                      example: 399
 *                                  avaiability:
 *                                      type: boolean
 *                                      example: true
 *          responses:
 *               200:
 *                  description: Product updated successfully 
 *                  content: 
 *                          application/json:
 *                                schema:
 *                                  $ref: '#/components/schemas/Product'
 *               400:
 *                  description: Bad request - invalid ID or invalid input data 
 *               404: 
 *                 description: Product not found 
 */

router.put('/:id',
    //reviso el parámetro
    param('id').isInt().withMessage('ID no válido'),
    body('name')
        .notEmpty().withMessage('El nombre del producto no puede estar vacío'),
    body('price')
        .notEmpty().withMessage('El precio del producto no puede estar vacío')
        .isNumeric().withMessage('El precio debe ser un número')
        .custom(value => value > 0).withMessage('El precio debe ser mayor a cero'),
    body('avaiability')
        .isBoolean().withMessage('Valor para disponibilidad no válido'),
    handleInputErrors,
    updateProduct)

/**
 * @swagger 
 * /api/products/{id}:
 *      patch:
 *          summary: Update product avaiability
 *          tags:
 *              - Products
 *          description: return de updated avaiability product
 *          parameters:
 *            - in: path
 *              name: id
 *              description: id of the product
 *              required: true
 *              schema: 
 *                  type: integer
 *          responses:
 *               200:
 *                  description: Avaiability product updated successfully 
 *                  content: 
 *                          application/json:
 *                                schema:
 *                                  $ref: '#/components/schemas/Product'
 *               404: 
 *                 description: Product not found 
 */

router.patch('/:id',
    param('id').isInt().withMessage('ID no válido'),
    handleInputErrors,
    updateAvaiability)

/**
 * @swagger 
 * /api/products/{id}:
 *      delete:
 *          summary: Delete a product by a given ID
 *          tags:
 *              - Products
 *          description: return a confirmation message
 *          parameters:
 *            - in: path
 *              name: id
 *              description: id of the product
 *              required: true
 *              schema: 
 *                  type: integer
 *          responses:
 *               200:
 *                  description: Successful response 
 *                  content: 
 *                      application/json:
 *                              schema:
 *                                 type: string
 *                                 value: "Producto Eliminado"
 *               404: 
 *                 description: Product not found 
 */

router.delete('/:id',
    param('id').isInt().withMessage('ID no válido'),
    handleInputErrors,
    deleteProduct)

export default router