const { Router } = require('express')

const routes = new Router()

//Import Controllers
const conectionsController = require('./controllers/conectionsController')
const loginController = require('./controllers/loginController')
const usersController = require('./controllers/usersController')
const produtosController = require('./controllers/produtosController')
const vendasController = require('./controllers/vendasController')
const salesController = require('./controllers/salesController')
const carsController = require('./controllers/carsController')
const deliverysController = require('./controllers/deliverysController')
const homeController = require('./controllers/homeController')

//Routes
//Conections
routes.get('/conections', conectionsController.findConections)
//Login
routes.post('/login', loginController.login)
//Users
routes.get('/users/:loja', usersController.index)
routes.post('/users', usersController.create)
routes.put('/users/:userId', usersController.update)
routes.delete('/users/:userId', usersController.delete)
//Produtos SCE CD
routes.get('/products/:typesearch/:search', produtosController.index)
//Vendas SCE
routes.get('/:loja/:emissao/vendas', vendasController.vendasSce)
routes.get('/:loja/vendas/:numvenda', vendasController.vendasSceProd)
routes.post('/:loja/vendas/submit', vendasController.submitSale)
//Sales Sono Delivery
routes.get('/sales', salesController.index)
//Cars
routes.get('/cars', carsController.index)
routes.post('/cars', carsController.create)
routes.put('/cars/:id', carsController.update)
routes.delete('/cars/:id', carsController.delete)
//Deliverys
routes.get('/deliverys', deliverysController.index)
routes.post('/deliverys', deliverysController.create)
routes.put('/deliverys/:id', deliverysController.update)
routes.delete('/deliverys/:id', deliverysController.delete)
routes.put('/deliverys/status/:id', deliverysController.updateSatus)
//Home
routes.get('/home', homeController.index)

module.exports = routes