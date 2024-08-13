//exit va a detener la ejecución de un código node js
import { exit } from 'node:process'
import db from '../config/db'

//este código va a limpiar mi base de datos
//cada vez que finalicen nuestrsas pruebas
const clearDB = async () => {
    try {
        //con este force elimino los datos de la db
        await db.sync({ force: true })
        console.log('Datos eliminados correctamente');

        //finaliza el programa, hasta acá llega, 
        //pero LO HIZO BIEN
        exit(0)

    } catch (error) {
        console.log(error);

        //exit 1 indica que el programa finalizó CON FALLAS
        exit(1)
    }
}

if (process.argv[2] === '--clear') {
    clearDB()
}