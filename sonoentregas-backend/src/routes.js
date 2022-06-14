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
const mainController = require('./controllers/mainController')
const maintDelivController = require('./controllers/maintDelivController')
const mainVisitController = require('./controllers/mainVisitController')
const feedStockController = require('./controllers/feedStockController')
const productsController = require('./controllers/productsController')
const devController = require('./controllers/devController')
const catDefController = require('./controllers/catDefController')

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
routes.get('/users', loginController.transformPasswordUser)
//Products SCE CD
routes.get('/productscd/:typesearch/:search', produtosController.index)
//Sales SCE
routes.get('/:loja/:emissao/vendas', vendasController.vendasSce)
routes.get('/:loja/vendas/:numvenda', vendasController.vendasSceProd)
routes.post('/:loja/vendas/submit', vendasController.submitSale)
routes.post('/vendas', vendasController.cancelSubmitSales)
routes.post('/vendas/reverse', vendasController.reverseStock)
//Sales Sono Delivery
routes.get('/sales/:typesearch/:search/:status/:codloja', salesController.index)
routes.get('/sales/:status/:where', salesController.sales)
routes.get('/salesProdct/:idSale/:codloja/:codproduto', salesController.findProductDetals)
routes.post('/sales/updateDate/:idSale', salesController.updaDateDeliv)
//Cars
routes.get('/cars', carsController.index)
routes.post('/cars', carsController.create)
routes.put('/cars/:id', carsController.update)
routes.delete('/cars/:id', carsController.delete)
//Deliverys
routes.get('/deliverys/:status', deliverysController.index)
routes.get('/deliverys/:status/:date', deliverysController.index)
routes.post('/deliverys', deliverysController.create)
routes.put('/deliverys/:id', deliverysController.update)
routes.delete('/deliverys/:id', deliverysController.delete)
routes.put('/deliverys/status/:id', deliverysController.updateSatus)
//Homes
routes.get('/home', homeController.index)
routes.get('/dashboard/:datesearch', dashboardController.index)
//Maintenance
routes.get('/maintenance/:codloja', mainController.index)
routes.get('/maintenance/:idSale/:codloja', mainController.searchSaleToMaint)
routes.post('/maintenance', mainController.create)
routes.delete('/maintenance/:id', mainController.delete)
routes.get('/maintenance/:typeSeach/:search/:codloja', mainController.findMain)
//Maintenance Delivery
routes.get('/maintenancedeliv', maintDelivController.index)
routes.get('/maintenancedeliv/:idMain', maintDelivController.findMaintId)
routes.get('/maintenancedeliv/:typeSeach/:search', maintDelivController.findMaintDeliv)
routes.post('/maintenancedeliv', maintDelivController.create)
routes.put('/maintenancedeliv/:id', maintDelivController.update)
//Maintenance Visit
routes.post('/maintvisit', mainVisitController.create)
routes.put('/maintvisit/start/:id', mainVisitController.startVisit)
routes.put('/maintvisit/finish/:id', mainVisitController.finishVisit)
// FeedStock
routes.get('/feedstock', feedStockController.index)
routes.get('/fdund', feedStockController.findUnd)
routes.get('/feedstock/:typeSearch/:search', feedStockController.searchFd)
routes.get('/feedstock/:id', feedStockController.find)
routes.post('/feedstock', feedStockController.create)
// Product
routes.get('/products', productsController.index)
routes.get('/products/:typeSearch/:search', productsController.searchProd)
routes.get('/products/create/feedstock/:id', productsController.searchFeedToCreate)
routes.get('/products/:id', productsController.find)
routes.post('/products', productsController.create)
// Category Def
routes.get('/catdef', catDefController.index)
//Developer 
routes.get('/dev/:table', devController.getTable)

module.exports = routes