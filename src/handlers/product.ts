import { Request, Response } from "express"
import Product from "../models/Product.model";

export const updateProduct = async (req: Request, res: Response) => {
    //primero verifico que ese producto exista
    const productByIdForUpdate = await Product.findByPk(req.params.id)

    if (!productByIdForUpdate) {
        return res.status(404).json({
            error: 'Producto no encontrado'
        })
    }

    await productByIdForUpdate.update(req.body)
    await productByIdForUpdate.save()
    res.json({ data: productByIdForUpdate })
}

export const getProductById = async (req: Request, res: Response) => {
    const productById = await Product.findByPk(req.params.id)

    if (!productById) {
        return res.status(404).json({
            error: 'Producto no encontrado'
        })
    }

    res.json({ data: productById })
}

export const getProducts = async (req: Request, res: Response) => {
    try {
        const products = await Product.findAll({
            //puedo ordenar lo que llega 
            //por ejemplo, de más barato a más caro
            order: [
                ['id', 'ASC']
            ],
            //puedo pedir únicamente algunos valores
            //para eso, por ejemplo, excluyo lo que no quiero
            attributes: { exclude: ['createdAt', 'updatedAt'] }
        })
        res.send({ data: products })
    } catch (error) {
        console.log(error);
    }
}

export const createProduct = async (req: Request, res: Response) => {

    //OPCION 1 PARA CREAR PRODUCTO
    try {
        const product = await Product.create(req.body)
        res.status(201).json({ data: product })
    } catch (error) {
        console.log(error);
    }


    //OPCION 2 PARA CREAR PRODUCTO
    // const product = new Product(req.body)
    // const saveProduct = await product.save()
    // res.json({ data: saveProduct })
}

export const updateAvaiability = async (req: Request, res: Response) => {
    try {
        //primero verifico que ese producto exista
        const productByIdForUpdateAvaiability = await Product.findByPk(req.params.id)

        if (!productByIdForUpdateAvaiability) {
            return res.status(404).json({
                error: 'Producto no encontrado'
            })
        }
        //de acá puedo sacar los valores de mi data y jugar con ellos
        //console.log(productByIdForUpdateAvaiability.dataValues);

        productByIdForUpdateAvaiability.avaiability = !productByIdForUpdateAvaiability.dataValues.avaiability
        await productByIdForUpdateAvaiability.save()
        res.json({ data: productByIdForUpdateAvaiability })
    } catch (error) {
        console.log(error);
    }
}

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const productByIdForDelete = await Product.findByPk(req.params.id)
        if (!productByIdForDelete) {
            return res.status(404).json({
                error: 'Producto no encontrado'
            })
        }
        await productByIdForDelete.destroy()
        res.json({ data: 'Producto Eliminado' })
    } catch (error) {
        console.log(error);
    }
}