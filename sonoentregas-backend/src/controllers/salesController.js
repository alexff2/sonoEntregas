//@ts-check
const Sales = require('../models/Sales')
const ViewDeliveryProd = require('../models/ViewDeliveryProd2')
const ViewDeliveries = require('../models/ViewDeliverys')

const SalesService = require('../services/salesService')

module.exports = {
  /**
   * @param {*} req 
   * @param {*} res 
   */
  async findSales( req, res ){
    try {
      const { status, typeSearch, search, codLoja } = req.query

      let sales
      let where = ''

      if (!status) {
        where = `${typeSearch} = '${search}'`

        sales = await SalesService.findSales(where)
      } else {
        if (status === 'open') {
          where = `STATUS = 'Aberta'`
          codLoja && (where +=` AND CODLOJA = ${codLoja}`)
          typeSearch && (where += ` AND ${typeSearch} LIKE '${search}%'`)

          sales = await SalesService.findSales(where)
        } else {
          typeSearch === 'D_DELIVERED'
            ? where += ` AND ${typeSearch} = '${search}'`
            : where += ` AND ${typeSearch} LIKE '${search}%'`

          codLoja && (where +=` AND A.CODLOJA = ${codLoja}`)

          sales = await SalesService.findFinishedSales(where, codLoja)
        }
      }

      return res.json(sales)
    } catch (error) {
      console.log(error)
      return res.status(400).json(error)
    }
  },
  /**
   * @param {*} req 
   * @param {*} res 
   */
  async findSalesToCreatedForecastByProduct(req, res){
    try {
      const { idProduct } = req.params

      const sales = await SalesService.findToCreateForecastByProduct(idProduct)

      return res.json(sales)
    } catch (e) {
      console.log(e)

      let status = e.status ? e.status : 400
      let error = e.error ? e.error : e

      return res.status(status).json(error)
    }
  },
  /**
   * @param {*} req 
   * @param {*} res 
   */
  async findSalesToCreatedForecast(req, res){
    try {
      const { idSale } = req.params

      if(isNaN(parseInt(idSale))) {
        console.log(idSale)
        throw new Error('Param idSale is not number!')
      }

      const sales = await SalesService.findToCreateForecast(parseInt(idSale))

      return res.json(sales)
    } catch (e) {
      console.log(e)

      let status = e.status ? e.status : 400
      let error = e.error ? e.error : e

      return res.status(status).json(error)
    }
  },
  /**
   * @param {*} req 
   * @param {*} res 
   */
  async findSalesToCreatedDelivery(req, res){
    try {
      const { idSale } = req.params

      if(isNaN(parseInt(idSale))) {
        console.log(idSale)
        throw new Error('Param idSale is not number!')
      }

      const sales = await SalesService.findToCreateRoutes({ idSale: parseInt(idSale) })

      return res.json(sales)
    } catch (e) {
      console.log(e)

      let status = e.status ? e.status : 400
      let error = e.error ? e.error : e

      return res.status(status).json(error)
    }
  },
  /**
   * @param {*} req 
   * @param {*} res 
   */
  async findProductDetails(req, res){
    try {
      const { idSale, idLoja, idProduct } = req.params
  
      const products = await ViewDeliveryProd.findSome(0, `ID_SALES = ${idSale} AND CODLOJA = ${idLoja} AND COD_ORIGINAL = '${idProduct}' ORDER BY ID_DELIVERY`)

      var resp
  
      if (products.length > 0 ) {
        const delivery = await ViewDeliveries.findSome(0, `ID = ${products[products.length - 1].ID_DELIVERY}`)
  
        resp = {products, delivery}
        return res.status(200).json(resp)
      } else {
        resp = false
        return res.status(204).json(resp)
      }
    } catch (error) {
      return res.status(400).json(error)
    }
  },
  /**
   * @param {*} req 
   * @param {*} res 
   */
  async updateDateDelivery( req, res ){
    try {
      const { idSale } = req.params
      const { dateDeliv, CODLOJA, OBS_SCHED } = req.body
  
      await Sales._query(0, `UPDATE SALES SET D_ENTREGA1 = '${dateDeliv}', SCHEDULED = 1, OBS_SCHEDULED = '${OBS_SCHED}' WHERE ID_SALES = ${idSale} AND CODLOJA = ${CODLOJA}`)

      res.json(dateDeliv)
    } catch (error) {
      res.status(400).json(error)
    }
  }
}