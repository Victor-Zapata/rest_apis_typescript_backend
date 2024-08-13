import express from 'express';
import router from './router';
import db from './config/db';
import colors from 'colors';
import cors, { CorsOptions } from 'cors';
import morgan from 'morgan';

//interfaz visual para la documentacion 
import swaggerUi from 'swagger-ui-express'
import swaggerSpec, { swaggerUiOptions } from './config/swagger';

//hago una funcion para conectarme a mi db

export const connectDB = async () => {
    try {
        await db.authenticate()
        db.sync()
        //console.log(colors.blue.bold('conexión exitosa a la db'));

    } catch (error) {
        console.log(error);
        console.log(colors.red.bold('hubo un error al conectar a la DB'));
    }
}

connectDB()

//instancia de express
const server = express()

//permitir conexiones
const corsOptions: CorsOptions = {
    //el origin, la funcion que mas abajo abro con otros dos parametros, es lo que me está enviando la petición (ej {name: teclado, price: 700})
    //la funcion origin lleva dos argumentos, origin: la info de quien envia la peticion y un callback que permite o niega la conexion
    origin: (origin, callback) => {

        if (origin === process.env.FRONTEND_URL) {

            //el callback toma dos parametros(si hay un error(en este caso no, por eso el null) y si permito o no la conexion(en este caso si, true))
            callback(null, true)
        } else {
            callback(new Error('Error de CORS'))
        }
    }
}
//server.use se usa con todos los verbos, acá estoy diciendo que quiero que estos cors se usen en toda mi aplicación
server.use(cors(corsOptions))

//leer datos de formulario(habilito la lectura)
server.use(express.json())

//con morgan voy a poder tener detalles de la peticion
server.use(morgan('dev'))
server.use('/api/products', router)

// server.get('/api', (req, res) => {
//     res.json({ msg: 'desde API para pruebas' })
// })

//documentacion
server.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions))

export default server