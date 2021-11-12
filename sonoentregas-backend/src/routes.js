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
const dashboardController = require('./controllers/dashboardController')

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
routes.post('/vendas', vendasController.cancelSubmitSales)
routes.post('/vendas/reverse', vendasController.reverseStock)
//Sales Sono Delivery
routes.get('/sales/:typesearch/:search/:status/:codloja', salesController.index)
routes.get('/salesProdct/:idSale/:codloja/:codproduto', salesController.findProductDetals)
routes.post('/sales/updateDate/:idSale', salesController.updaDateDeliv)
//Cars
routes.get('/cars', carsController.index)
routes.post('/cars', carsController.create)
routes.put('/cars/:id', carsController.update)
routes.delete('/cars/:id', carsController.delete)
//Deliverys
routes.get('/deliverys/:status', deliverysController.index)
routes.post('/deliverys', deliverysController.create)
routes.put('/deliverys/:id', deliverysController.update)
routes.delete('/deliverys/:id', deliverysController.delete)
routes.put('/deliverys/status/:id', deliverysController.updateSatus)
//Home
routes.get('/home', homeController.index)
routes.get('/dashboard/:datesearch', dashboardController.index)

module.exports = routes