const Deliverys = require('../models/Deliverys')
const DeliverySales = require('../models/DeliverySales')
const ViewDeliverySales = require('../models/ViewDeliverySales')
const Sales = require('../models/Sales')
const SalesProd = require('../models/SalesProd')
const Produtos = require('../models/Produtos')

module.exports = {
  async index( req, res ){
    try {
      const deliverys = await Deliverys.findAll(0)
  
      for (let i = 0; i < deliverys.length; i++) {
        var sales = await ViewDeliverySales.findSome(0, `ID_DELIVERY = ${deliverys[i].ID}`)

        for (let j = 0; j < sales.length; j++) {
          var products = await SalesProd.findSome(0, `ID_SALES = ${sales[j].ID_SALES} AND CODLOJA = ${sales[j].CODLOJA}`)
          sales[j]['products'] = products
        }

        deliverys[i]['sales'] = sales 
      }

      res.json(deliverys)
    } catch (error) {
      res.status(400).json(error)
    }
  },
  async create( req, res ){
    try {
      const { description, codCar, codDriver, sales, status } = req.body

      const valuesDelivery = `'${description}', ${codCar}, ${codDriver}, '${status}'`
      
      const dataDelivery = await Deliverys.creator(0, valuesDelivery)
      
      await sales.forEach( async sale => {
        var { ID_SALES, CODLOJA } = sale
        
        var valueSale = `${dataDelivery.ID}, ${CODLOJA}, '${ID_SALES}'`
        
        await DeliverySales.creatorNotReturn(0, valueSale, true)

        await Sales.updateNotReturn(0, `STATUS = 'Em lançamento'`, ID_SALES, 'ID_SALES')
        
        sale.STATUS = 'Em lançamento'
        
        await Deliverys._query(CODLOJA, `UPDATE NVENDA2 SET STATUS = 'Em lançamento' WHERE CODIGOVENDA = ${ID_SALES}`)
      })
      
      dataDelivery['sales'] = sales
      
      return res.json(dataDelivery)
    } catch (error) {
      res.status(400).json(error)
    }
  },
  async update( req, res ) {
    try {
      const { id } = req.params
      const { description, codCar, codDriver } = req.body

      const script = `DESCRIPTION = '${description}', ID_CAR = ${codCar}, ID_DRIVER = ${codDriver}`
      
      const delivery = await Deliverys.update(0, script, id)

      res.json(delivery)
    } catch (e) {
      res.status(400).json(e)
    }
  },
  async delete( req, res ) {
    try {
      const { id } = req.params
      
      await Deliverys.deleteNotReturn(0, id)

      const deliverySales = await DeliverySales.findSome(0, `ID_DELIVERY = ${id}`)
      
      for (let i = 0; i < deliverySales.length; i++) {
        await Deliverys._query(0, `UPDATE SALES SET STATUS = 'Enviado' WHERE ID_SALES = ${deliverySales[i].ID_SALE} AND CODLOJA = ${deliverySales[i].CODLOJA}`)
        
        await Deliverys._query(deliverySales[i].CODLOJA, `UPDATE NVENDA2 SET STATUS = 'Enviado' WHERE CODIGOVENDA = ${deliverySales[i].ID_SALE}`)
      }

      await DeliverySales.deleteNotReturn(0, id, 'ID_DELIVERY')

      res.json({delete: true})
    } catch (error) {
      res.status(400).json(error)
    }
  },
  async updateSatus( req, res ){
    const { id } = req.params
    const delivery = req.body

    try {
      for (let i = 0; i < delivery.sales.length; i++) {

        var dEntrega

        if (delivery.STATUS === 'Finalizada') {
          
          dEntrega =  `, D_ENTREGA2 = '${delivery.dateDelivery}'`
   
        } else {
          dEntrega = ''
        }
        
        await Deliverys._query(0, `UPDATE SALES SET STATUS = '${delivery.sales[i].STATUS}' ${dEntrega} WHERE ID_SALES = ${delivery.sales[i].ID_SALES} AND CODLOJA = ${delivery.sales[i].CODLOJA}`)
        
        await Deliverys._query(delivery.sales[i].CODLOJA, `UPDATE NVENDA2 SET STATUS = '${delivery.sales[i].STATUS}' WHERE CODIGOVENDA = ${delivery.sales[i].ID_SALES}`)
        
        if (delivery.sales[i].STATUS === 'Finalizada') {
          for (let j = 0; j < delivery.sales[i].products.length; j++) {
            var qtd = delivery.sales[i].products[j].QUANTIDADE
            var cod = delivery.sales[i].products[j].COD_ORIGINAL
            await Produtos._query(1,`UPDATE PRODLOJAS SET EST_ATUAL = EST_ATUAL - ${qtd}, EST_LOJA = EST_LOJA - ${qtd} FROM PRODLOJAS A INNER JOIN PRODUTOS B ON A.CODIGO = B.CODIGO WHERE A.CODLOJA = 1 AND B.ALTERNATI = '${cod}'`)
          }
        }
      }
      
      await Deliverys.updateNotReturn(0, `STATUS = '${delivery.STATUS}'`, id)
      
      res.json(delivery)
    } catch (e) {
      res.status(400).json(e)
    }
  }
}