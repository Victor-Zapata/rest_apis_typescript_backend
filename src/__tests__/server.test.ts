import request from 'supertest'
import server, { connectDB } from '../server'
import db from '../config/db'

// describe('GET /api', () => {
//     it('should send back a json response', async () => {
//         const response = await request(server).get('/api')

//         expect(response.status).toBe(200)
//     })
// })

//vamos a forzar un error en la conexion de la db para que vaya al catch y de esa forma probarlo
//creamos un mock e importamos la instancia de sequelize...ese mock simula la conexion a la DB
jest.mock('../config/db')

describe('connectDB', () => {
    it('Should handle db connection error', async () => {
        //creamos un espia que espera que se ejecute db.authenticate
        //spyOn toma dos parametros, un objeto y un metodo
        //spyOn espia u observa lo que hace este metodo
        //lo que hace es: importa la conexion, espera que ocurra authenticate (linea 10 de server.ts) y con el mock lanzamos una excepción para que se vaya al catch (porque queremos probar el catch, entonces el reject rechaza la promesa para forzar la excepción)
        jest.spyOn(db, 'authenticate').mockRejectedValueOnce(new Error('hubo un error al conectar a la DB'))
        //para escuchar ese evento de error tengo un segundo espía
        const consoleSpy = jest.spyOn(console, 'log')
        //una vez tengo los espias, mando llamar la conexion (un espia niega la promesa, el otro la espera y escucha)
        await connectDB()

        expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('ubo un error al conectar a la DB'))
    })
})