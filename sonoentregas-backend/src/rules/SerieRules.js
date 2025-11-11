//@ts-check
const ProdLojaSeriesModel = require('../models/tables/ProdLojaSeriesMovimentos')
const DeliveryModel = require('../models/Deliverys')
const TransferOfProductsModel = require('../models/tables/TransferOfProducts')
const PurchaseNoteModel = require('../models/tables/PurchaseNote')
const SaleReturnModel = require('../models/tables/Returns/index')
const MaintenanceDelivModel = require('../models/tables/MaintenanceDeliv')

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

  async finishesIfOpened({serialNumber, productId}, connection){
    const isAlreadySerialNumber = await ProdLojaSeriesModel.findAny(1, {
      serialNumber,
      isNull: 'outputBeepDate'
    }, '*', connection)

    if (isAlreadySerialNumber.length === 0) {
      throw {
        error: 'the serial number has already been finalized or has not been entered!'
      }
    }

    if (isAlreadySerialNumber[0].productId !== productId) {
      throw {
        error: 'This serial number does not belong to this product!'
      }
    }
  }

  async checkModule(modele, moduleId, connections) {
    const { sce, entrega } = connections

    if(modele === 'maintenance') {
      const maintenance = await MaintenanceDelivModel.findAny(0, { id: moduleId }, '*', entrega)

      if (maintenance.length === 0) {
        throw {
          error: 'Maintenance not exist!'
        }
      }
    }

    if(modele === 'saleReturn') {
      const saleReturn = await SaleReturnModel.findAny(0, { id: moduleId }, '*', entrega)

      if (saleReturn.length === 0) {
        throw {
          error: 'SaleReturn not exist!'
        }
      }
    }

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
      const purchaseNote = await PurchaseNoteModel.findAny(
        1,
        { NUM_DOC: moduleId },
        '*',
        sce
      )

      if (purchaseNote.length === 0) {
        throw {
          error: 'Purchase Note not exist!'
        }
      }
    }
  }

  async serialNumberMayReturn({serialNumber, moduleId, module, productId }, connection) {
    const serialNumberExists = await ProdLojaSeriesModel.findAny(1, {
      serialNumber,
      productId,
      outputModuleId: moduleId,
      outputModule: module,
    }, '*', connection);

    if (serialNumberExists.length > 0) {
      return true;
    }

    return false;
  }
}

module.exports = new SerieRules()
