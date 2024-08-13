import request from 'supertest'
import server from '../../server'

describe('POST /api/products', () => {

    it('should display validation errors', async () => {
        const response = await request(server).post('/api/products').send({})

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(4)

        expect(response.status).not.toBe(201)
        expect(response.body.errors).not.toHaveLength(2)

    })

    it('should validate that the price greater than 0', async () => {
        const response = await request(server).post('/api/products').send({
            name: "TV para test con precio mal",
            price: 0
        })

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)

        expect(response.status).not.toBe(201)
        expect(response.body.errors).not.toHaveLength(2)

    })

    it('should validate that the price be a number', async () => {
        const response = await request(server).post('/api/products').send({
            name: "TV para test con precio mal",
            price: "hola"
        })

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(2)

        expect(response.status).not.toBe(201)
        expect(response.body.errors).not.toHaveLength(3)

    })

    it('should send back a new product', async () => {
        const response = await request(server).post('/api/products').send({
            name: "TV para test",
            price: 500
        })

        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty('data')

        expect(response.status).not.toBe(404)
        expect(response.body).not.toHaveProperty('errors')

    })
})

describe('GET /api/products', () => {
    it('should be an array and have data', async () => {
        const response = await request(server).get('/api/products')
        expect(response.status).toBe(200)
        //reviso que me devuelva un json
        expect(response.headers['content-type']).toMatch(/json/)
        expect(response.body).toHaveProperty('data')
        expect(response.body.data).toHaveLength(1)

        expect(response.status).not.toBe(404)
        expect(response.body).not.toHaveProperty('errors')

    })
})

describe('GET /api/products/:id', () => {
    it("Should return a 404 response for a non-existent product", async () => {
        const productId = 4000
        const response = await request(server).get(`/api/products/${productId}`)

        expect(response.status).toBe(404)
        expect(response.body).toHaveProperty('error')
        expect(response.body.error).toBe('Producto no encontrado');

        expect(response.status).not.toBe(201)
        expect(response.body).not.toHaveProperty('data')
    })

    it('Should check a valid Id in the URL', async () => {
        const response = await request(server).get('/api/products/not-valid-url')

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe('ID no válido');
    })

    it('get a JSON response for a single product', async () => {
        const response = await request(server).get('/api/products/1')

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('data')
    })
})

describe('PUT /api/products/:id', () => {

    it('Should check a valid Id in the URL', async () => {
        const response = await request(server).put('/api/products/not-valid-url').send({
            name: 'Auriculares',
            avaiability: true,
            price: 300
        })

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe('ID no válido');

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    })

    it('Should display validation error messages when updating a product', async () => {
        const response = await request(server).put('/api/products/1').send({})

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(5);
        //con truthy detecta si tiene algo y lo trata como true
        expect(response.body.errors).toBeTruthy();

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    })

    it('Should validate that the price is greater than 0', async () => {
        const response = await request(server).put('/api/products/1').send({
            name: 'parlante Samsung',
            avaiability: true,
            price: -300
        })

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)
        //con truthy detecta si tiene algo y lo trata como true
        expect(response.body.errors).toBeTruthy()
        expect(response.body.errors[0].msg).toBe('El precio debe ser mayor a cero')

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    })

    it('Should check if the product exists in the db', async () => {
        const productId = 5000
        const response = await request(server).put(`/api/products/${productId}`).send({
            name: 'Auriculares',
            avaiability: true,
            price: 300
        })

        expect(response.status).toBe(404)
        expect(response.body.error).toBe('Producto no encontrado');

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    })

    it('Should update an existing product in the db', async () => {
        const response = await request(server).put('/api/products/1').send({
            name: 'Auriculares actualizado',
            avaiability: true,
            price: 300
        })

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('data')

        expect(response.status).not.toBe(400)
        expect(response.status).not.toHaveProperty('errors')
    })

})

describe('PATCH /api/products/:id', () => {
    it('Should check a valid Id in the URL', async () => {
        const productId = 2000
        const response = await request(server).patch(`/api/products/${productId}`)

        expect(response.status).toBe(404)
        expect(response.body).toHaveProperty('error')
        expect(response.body.error).toBe('Producto no encontrado')


        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    })

    it('Should update the product avaiability', async () => {
        const response = await request(server).patch('/api/products/1')

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('data')
        expect(response.body.data.avaiability).toBe(false)

        expect(response.status).not.toBe(404)
        expect(response.status).not.toBe(400)
        expect(response.body).not.toHaveProperty('error')


    })
})

describe('DELETE /api/products/:id', () => {

    it('Should return a 404 response for a non-existent product', async () => {
        const productId = 2000
        const response = await request(server).delete(`/api/products/${productId}`)

        expect(response.status).toBe(404)
        expect(response.body).toHaveProperty('error')
        expect(response.body.error).toBe('Producto no encontrado')

        expect(response.status).not.toBe(200)
    })

    it('Should delete a product', async () => {
        const response = await request(server).delete('/api/products/1')

        expect(response.status).toBe(200)
        expect(response.body.data).toBe('Producto Eliminado')

        expect(response.status).not.toBe(404)
        expect(response.status).not.toBe(400)

    })
})