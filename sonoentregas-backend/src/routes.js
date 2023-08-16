const { Router } = require('express')

const routes = new Router()

const { ensureAuthenticated } = require('./middlewares/ensureAuthenticated')

//Import Controllers
const connectionsController = require('./controllers/connectionsController')
const authController = require('./controllers/authController')
const usersController = require('./controllers/usersController')
const productsController = require('./controllers/productsController')
const salesSceController = require('./controllers/salesSceController')
const salesController = require('./controllers/salesController')
const carsController = require('./controllers/carsController')
const forecastController = require('./controllers/forecastController')
const forecastValidationController = require('./controllers/forecastValidationController')
const deliverysController = require('./controllers/deliverysController')
const deliveryUpdateController = require('./controllers/deliveryUpdateController')
const homeController = require('./controllers/homeController')
const dashboardController = require('./controllers/dashboardController')
const maintController = require('./controllers/maintController')
const maintDelivController = require('./controllers/maintDelivController')
const mainVisitController = require('./controllers/mainVisitController')
const feedStockController = require('./controllers/feedStockController')
const bedsController = require('./controllers/bedsController')
const configBedsController = require('./controllers/configBedController')
const sizesController = require('./controllers/sizesController')
const reportsController = require('./controllers/rerportsController')
const devController = require('./controllers/devController')
const catDefController = require('./controllers/catDefController')
const goalsController = require('./controllers/goalsController')

//Routes
//Connections
routes.get('/connections', connectionsController.findConnections)
//Shops
routes.get('/shops', connectionsController.findShops)
//Login
routes.post('/authenticated', authController.create)
routes.get('/token/validation', authController.validationToken)
//Users
routes.get('/users/:loja', usersController.index)
routes.post('/users', usersController.create)
routes.put('/users/:userId', usersController.update)
  //Products SCE CD
  routes.get('/products/:typesearch/:search', productsController.index)
  //Sales SCE Shops
  routes.get('/salesshop/:emissao/:loja', salesSceController.salesSce)
  routes.get('/sales/:codDAV/shop/:idShop/products', salesSceController.salesSceProd)
  routes.post('/salesshop/:loja', salesSceController.sendSale)
  routes.post('/salesshop', salesSceController.cancelSubmitSales)
  routes.post('/salesshop/reverse/:idSale', salesSceController.reverseStock)
  routes.put('/sales/:idSale/updateAddress', salesSceController.updateAddressClient)
//Sales Sono Delivery
routes.get('/sales', salesController.findSales)
routes.get('/sales/:idSale/forecast/create', salesController.findSalesToCreatedForecast)
routes.get('/sales/forecast/create/product/:idProduct', salesController.findSalesToCreatedForecastByProduct)
routes.get('/sales/:idSale/routes/create', salesController.findSalesToCreatedDelivery)
routes.get('/sales/:idSale/loja/:idLoja/product/:idProduct', salesController.findProductDetails)
routes.post('/sales/updateDate/:idSale', salesController.updateDateDelivery)
//Cars
routes.get('/cars', carsController.index)
routes.post('/cars', carsController.create)
routes.put('/cars/:id', carsController.update)
// Forecasts
routes.get('/forecast', forecastController.findCreatedForecast)
routes.get('/forecast/finished', forecastController.findFinishedForecast)
routes.post('/forecast', ensureAuthenticated, forecastController.create)
routes.put('/forecast/:id/started', ensureAuthenticated, forecastController.started)
routes.post('/forecast/:id/sales/add', ensureAuthenticated, forecastController.addSale)
routes.put('/forecast/:idForecast/sale/:id/validation', ensureAuthenticated, forecastValidationController.validation)
routes.put('/forecast/:idForecast/sale/:id/invalidation/request', ensureAuthenticated, forecastValidationController.requestInvalidation)
routes.put('/forecast/:idForecast/sale/:id/invalidation', ensureAuthenticated, forecastValidationController.invalidate)
routes.put('/forecast/:idForecast/sale/:id/rmv/auth', ensureAuthenticated, forecastValidationController.authRemove)
routes.delete('/forecast/sale/:id', ensureAuthenticated, forecastController.rmvSale)
routes.put('/forecast/:id/finish', ensureAuthenticated, forecastController.finishForecast)

//Deliveries
routes.get('/deliverys/:status', deliverysController.index)
routes.get('/deliverys/:status/:date', deliverysController.index)
routes.post('/deliverys', ensureAuthenticated, deliverysController.create)
routes.post('/delivery/:id/sales/add', ensureAuthenticated, deliverysController.addSale)
routes.post('/delivery/sale/rmv', ensureAuthenticated, deliverysController.rmvSale)
routes.delete('/deliverys/:id', ensureAuthenticated, deliverysController.delete)

routes.post('/delivery/withdrawal', ensureAuthenticated, deliveryUpdateController.withdrawalSale)
routes.put('/deliverys/:id/header', ensureAuthenticated, deliveryUpdateController.updateHeader)
routes.put('/delivery/:id/delivering/developing', ensureAuthenticated, deliveryUpdateController.delivering)
routes.put('/delivery/:id/finish/developing', ensureAuthenticated, deliveryUpdateController.finish)
routes.put('/deliverys/status/:id', ensureAuthenticated, deliveryUpdateController.updateStatus)

//Homes
routes.get('/home', homeController.index)
routes.get('/dashboard/:dateSearch', dashboardController.index)
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
routes.get('/feedstock/unit', feedStockController.findUnd)
routes.get('/feedstock/:id', feedStockController.find)
routes.get('/feedstock/:typeSearch/:search', feedStockController.searchFeed)
routes.post('/feedstock', feedStockController.create)
// Beds
routes.get('/beds', bedsController.index)
routes.get('/beds/:id', bedsController.find)
routes.get('/beds/:typeSearch/:search', bedsController.searchProd)
routes.post('/beds', bedsController.create)
//Config Beds
routes.get('/config/beds', configBedsController.index)
routes.post('/config/beds', configBedsController.create)
routes.put('/config/beds', configBedsController.inactivate)
//Config Size Beds
routes.get('/sizes', sizesController.index)
routes.get('/sizes/:find', sizesController.find)
routes.post('/sizes', sizesController.create)
// Category Def
routes.get('/catdef', catDefController.index)
//Reports
routes.get('/reports', reportsController.listProducts)
routes.get('/reports/sales/open', reportsController.salesOpen)
routes.get('/reports/products/movement', reportsController.productsMovement)
routes.get('/reports/purchase/requests', reportsController.purchaseRequest)
// Golas and OnSale
routes.get('/goals', goalsController.index)
routes.post('/goals', ensureAuthenticated, goalsController.create)
routes.put('/goals/:id', ensureAuthenticated, goalsController.update)
routes.get('/goals/getAmount', goalsController.getAmountReached)
//Developer 
routes.get('/dev', devController.getTable)

module.exports = routes