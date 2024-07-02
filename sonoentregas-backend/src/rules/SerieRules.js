//@ts-check
const ProdLojaSeriesModel = require('../models/tables/ProdLojaSeriesMovimentos')
const DeliveryModel = require('../models/Deliverys')
const TransferOfProductsModel = require('../models/tables/TransferOfProducts')
const PurchaseNoteModel = require('../models/tables/PurchaseNote')

class SerieRules {
  async createIfDoesNotExistFinished({serialNumber}, connection){
    const prodLojaSeriesOpen = await ProdLojaSeriesModel.findAny(1, {
      serialNumber,
      isNull: 'outputBeepDate'
    }, '*', connection)

    if (prodLojaSeriesOpen.length > 0) {
      throw {
        error: 'the serial number already exists and is not finalized!'
      }
    }
  }

  async finishesIfOpened({serialNumber}, connection){
    const isAlreadySerialNumber = await ProdLojaSeriesModel.findAny(1, {
      serialNumber,
      isNull: 'outputBeepDate'
    }, '*', connection)

    if (isAlreadySerialNumber.length === 0) {
      throw {
        error: 'the serial number already exists and is not finalized!'
      }
    }
  }

  async checkModule(modele, moduleId, connections) {
    const { sce, entrega } = connections

    if(modele === 'delivery') {
      const delivery = await DeliveryModel.findAny(0, { id: moduleId }, '*', entrega)

      if (delivery.length === 0) {
        throw {
          error: 'Delivery not exist!'
        }
      }
    }

    if(modele === 'transfer') {
      const transferOfProducts = await TransferOfProductsModel.findAny(1, { CODIGO: moduleId }, '*', sce)

      if (transferOfProducts.length === 0) {
        throw {
          error: 'Transfer of product not exist!'
        }
      }
    }

    if(modele === 'purchaseNote') {
      const purchaseNote = await PurchaseNoteModel.findAny(1, { NF: moduleId }, '*', sce)

      if (purchaseNote.length === 0) {
        throw {
          error: 'Purchase Note not exist!'
        }
      }
    }
  }
}

module.exports = new SerieRules()
