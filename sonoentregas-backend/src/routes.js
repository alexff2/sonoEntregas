const { Router } = require('express')

const routes = new Router()

//Import Controllers
const conectionsController = require('./controllers/conectionsController')
const authController = require('./controllers/authController')
const usersController = require('./controllers/usersController')
const productsController = require('./controllers/productsController')
const salesSceController = require('./controllers/salesSceController')
const salesController = require('./controllers/salesController')
const carsController = require('./controllers/carsController')
const deliverysController = require('./controllers/deliverysController')
const homeController = require('./controllers/homeController')
const dashboardController = require('./controllers/dashboardController')
const maintController = require('./controllers/maintController')
const maintDelivController = require('./controllers/maintDelivController')
const mainVisitController = require('./controllers/mainVisitController')
const feedStockController = require('./controllers/feedStockController')
const bedsController = require('./controllers/bedsController')
const configBedsController = require('./controllers/configBedController')
const sizesController = require('./controllers/sizesController')
const devController = require('./controllers/devController')
const catDefController = require('./controllers/catDefController')

//Routes
//Conections
routes.get('/conections', conectionsController.findConections)
//Login
routes.post('/authenticated', authController.create)
//Users
routes.get('/users/:loja', usersController.index)
routes.post('/users', usersController.create)
routes.put('/users/:userId', usersController.update)
  //Products SCE CD
  routes.get('/products/:typesearch/:search', productsController.index)
  //Sales SCE Shops
  routes.get('/salesshop/:emissao/:loja', salesSceController.salesSce)
  routes.get('/salesshop/products/:numSale/:loja', salesSceController.salesSceProd)
  routes.post('/salesshop/:loja', salesSceController.sendSale)
  routes.post('/salesshop', salesSceController.cancelSubmitSales)
  routes.post('/salesshop/reverse', salesSceController.reverseStock)
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
routes.get('/maintenance/:codloja', maintController.index)
routes.get('/maintenance/:idSale/:codloja', maintController.searchSaleToMaint)
routes.post('/maintenance', maintController.create)
routes.delete('/maintenance/:id', maintController.delete)
routes.get('/maintenance/:typeSeach/:search/:codloja', maintController.findMain)
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
routes.get('/feedstock/:id', feedStockController.find)
routes.get('/feedstock/:typeSearch/:search', feedStockController.searchFeed)
routes.post('/feedstock', feedStockController.create)
routes.get('/fdund', feedStockController.findUnd)
// Beds
routes.get('/beds', bedsController.index)
routes.get('/beds/:id', bedsController.find)
routes.get('/beds/:typeSearch/:search', bedsController.searchProd)
routes.post('/beds', bedsController.create)
//Config Beds
routes.get('/configbeds', configBedsController.index)
routes.post('/configbeds', configBedsController.create)
routes.put('/configbeds', configBedsController.inactivate)
//Config Size Beds
routes.get('/sizes', sizesController.index)
routes.get('/sizes/:find', sizesController.find)
routes.post('/sizes', sizesController.create)
routes.put('/sizes', sizesController.inactivate)
// Category Def
routes.get('/catdef', catDefController.index)
//Developer 
routes.get('/dev/:table', devController.getTable)

module.exports = routes