import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

// un middleware es una capa de software que añade funcionalidades y facilita la interacción entre distintas partes de un sistema o entre diferentes sistemas, haciendo que la arquitectura sea más flexible, modular y mantenible

//valido no tener errores a través de un middleware
export const handleInputErrors = (req: Request, res: Response, next: NextFunction) => {
    let errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    next()
}

