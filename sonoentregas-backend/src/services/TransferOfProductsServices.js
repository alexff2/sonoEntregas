//@ts-check
/**
 * @typedef {Object} ITransferRequest
 * @property {string} issue
 * @property {string} reason
 * @property {string} observation
 * @property {number} originId
 * @property {string} origin
 * @property {number} destinyId
 * @property {string} destiny
 * @property {ITransfersProductsRequestResponse[]} products
 * 
 * @typedef {Object} ITransferResponse
 * @property {string} status
 * @property {number} id
 * @property {string} issue
 * @property {string} issueIso
 * @property {string} reason
 * @property {string} observation
 * @property {number} originId
 * @property {string} origin
 * @property {number} destinyId
 * @property {string} destiny
 * @property {string} user
 * @property {'C' | 'D'} type
 * @property {ITransfersProductsRequestResponse[]} products
 * 
 * @typedef {Object} ITransfersProductsRequestResponse
 * @property {number} id
 * @property {number} item
 * @property {number} quantity
 * @property {string} name
 * @property {string} status
 * @property {number} transferId
 * @property {number} purchasePrice
 * 
 * @typedef {Object} ITransfersToBeep
 * @property {number} id
 * @property {number} item
 * @property {number} quantity
 * @property {number} moduleId
 * @property {string} type
 * 
 * @typedef {Object} ITransfersSce
 * @property {number} CODIGO
 * @property {number} CODLOJA
 * @property {number} LOJAORIGEM
 * @property {number} LOJADESTINO
 * @property {Date | string} EMISSAO
 * @property {string} HORA
 * @property {string} MOTIVO
 * @property {string} USUARIO
 * @property {string} OBSERVA
 * @property {'C' | 'D'} TIPODC
 * @property {number} SEQUENCIA
 * @property {string} EMITIUNF
 * @property {string} NOME_LOJADESTINO
 * @property {number} NNF_TRANSFERENCIA
 * @property {string} D_LAN
 * 
 * @typedef {Object} ITransfersProductsSce
 * @property {number} REGISTRO
 * @property {number} CODPRODUTO
 * @property {number} QUANTIDADE
 * @property {number} ITEM
 * @property {number} UNITARIOBRUTO
 * @property {number} PERCDESCONTO
 * @property {number} UNITARIOLIQUIDO
 * @property {number} VALORTOTALLIQUIDO
 * @property {string} MU_UNIDADE
 * @property {number} MU_ITEM
 * @property {number} MU_QTE_MENORUN
 * @property {number} ITEM_LOTE
 * 
 * @typedef {Object} IProduct
 * @property {number} CODIGO
 * @property {number} NOME
 * @property {string} ALTERNATI
 * 
 * @typedef {Object} IProdLojasSeries
 * @property {number} id
 * @property {number} productId
 * @property {number} serialNumber
 * @property {string} inputModule
 * @property {number} inputModuleId
 * @property {Date} inputBeepDate
 * @property {number} inputUserId
 * @property {string} outputModule
 * @property {number} outputModuleId
 * @property {Date} outputBeepDate
 * @property {number} outputUserId
 */

const { QueryTypes } = require('sequelize')
const UserModel = require('../models/Users')
const TransferOfProductsModel = require('../models/tables/TransferOfProducts')
const TransferProductModel = require('../models/tables/TransferOfProducts/TransferProduct')
const scriptTransferOfProducts = require('../scripts/TransferOfProduct')
const ProductsService = require('./ProductsService')
const ShopsSceService = require('./ShopSceService')
const KardexService = require('./InsertKardex')
const DateTime = require('../class/Date')

class TransferServices {
 /**
  * @param {'id' | 'issue'} type 
  * @param {string} search
  * @param {any} connection
  * @returns {Promise<ITransferResponse[] | []>}
  */
  async find(type, search, connection) {
    const where = {
      id: { CODIGO: search },
      issue: { EMISSAO: search },
    }

    /**@type {ITransfersSce[]} */
    const transfers = await TransferOfProductsModel.findAny(1, where[type], '*', connection)
    
    if (transfers.length === 0) {
      return []
    }

    const ids = transfers.map(t => t.CODIGO)

    const scriptProducts = scriptTransferOfProducts.findProducts(ids)
    /**@type {ITransfersProductsRequestResponse[]} */
    const transferProducts = await TransferProductModel._query(1, scriptProducts, QueryTypes.SELECT, connection)

    const scriptSerialNumbersCredit = scriptTransferOfProducts.findSerialNumbers(ids, 'C')
    const scriptSerialNumbersDeficit = scriptTransferOfProducts.findSerialNumbers(ids, 'D')
    /**@type {IProdLojasSeries[]} */
    const prodLojasSeriesCredit = await TransferProductModel._query(1, scriptSerialNumbersCredit, QueryTypes.SELECT, connection)
    /**@type {IProdLojasSeries[]} */
    const prodLojasSeriesDeficit = await TransferProductModel._query(1, scriptSerialNumbersDeficit, QueryTypes.SELECT, connection)

    const shops = await ShopsSceService.find(connection)

    return transfers.map(transfer => {
      const issueObj = new DateTime(transfer.EMISSAO)
      let serialNumbersTotal = 0

      const products = transferProducts
        .filter(product => product.transferId === transfer.CODIGO)
        .map(product => {
          let serialNumbers = []

          if (transfer.TIPODC === 'C') {
            serialNumbers = prodLojasSeriesCredit
              .filter(serial => serial.productId === product.id && serial.inputModuleId === product.transferId)
              .map(serial => serial.serialNumber)
          } else {
            serialNumbers = prodLojasSeriesDeficit
              .filter(serial => serial.productId === product.id && serial.outputModuleId === product.transferId)
              .map(serial => serial.serialNumber)
          }

          serialNumbersTotal += serialNumbers.length

          return {
            ...product,
            serialNumbers,
            status: serialNumbers.length < product.quantity ? 'P' : 'B'
          }
        })

      const totalItems = products.reduce((sum, prod) => sum + prod.quantity, 0)
      return {
        status: serialNumbersTotal === totalItems ? 'B' : 'P',
        type: transfer.TIPODC,
        id: transfer.CODIGO,
        issue: issueObj.getBRDateTime().date,
        issueIso: issueObj.getISODateTimeBr().date,
        origin: shops.filter(shop => shop.code === transfer.LOJAORIGEM)[0].name,
        originId: transfer.LOJAORIGEM,
        destiny: shops.filter(shop => shop.code === transfer.LOJADESTINO)[0].name,
        destinyId: transfer.LOJADESTINO,
        destinyAddress: shops.filter(shop => shop.code === transfer.LOJADESTINO)[0].address,
        reason: transfer.MOTIVO,
        observation: transfer.OBSERVA,
        user: transfer.USUARIO,
        products
      }
    })
  }

  /**@param {number} id */
  async findToBeep(id){
    const scriptProducts = scriptTransferOfProducts.findProductsQuantity(id)
    /**@type {ITransfersToBeep[]} */
    const transferProducts = await TransferProductModel._query(1, scriptProducts, QueryTypes.SELECT)

    if (transferProducts.length === 0) {
      throw {
        error: 'not found transfer!'
      }
    }

    const scriptSerialNumbers = scriptTransferOfProducts.findSerialNumbers(
      id, transferProducts[0].type
    )
    /**@type {IProdLojasSeries[]} */
    const prodLojasSeries = await TransferProductModel._query(1, scriptSerialNumbers, QueryTypes.SELECT)

    const productsGrouped =  await ProductsService.findGrouped(transferProducts.map(product=> product.id))

    return productsGrouped.map(group => ({
      group: group.group,
      products: group.products.map(product => {
        const transferProduct = transferProducts
          .find( transferProduct => transferProduct.id === product.id)
        const quantityBeep = prodLojasSeries.filter(serie => serie.productId === product.id).length

          return {
          ...product,
          ...transferProduct,
          quantityBeep,
          quantityPedding: (transferProduct?.quantity || 0) - quantityBeep
        }
      })
    }))
  }

 /**
  * @param {ITransferRequest} transferRequest 
  * @param {number} userId
  * @param {any} connection
  * @returns 
  */
  async create(transferRequest, userId, connection) {
    const scriptMaxCodes = scriptTransferOfProducts.maxCodes()
    const maxCodes = await TransferOfProductsModel._query(
      1,
      scriptMaxCodes,
      QueryTypes.SELECT,
      connection
    )

    const user = await UserModel.findAny(0, { id: userId })

    const scriptInsertMaxSeq = scriptTransferOfProducts
      .insertMaxSeq(maxCodes[0].maxSequence + 1)
    await TransferOfProductsModel._query(
      1,
      scriptInsertMaxSeq,
      QueryTypes.INSERT,
      connection
    )

    const type = transferRequest.originId === 1 ? 'D' : 'C'

    /**@type {ITransfersSce} */
    const transferCreate = {
      CODIGO: maxCodes[0].maxId + 1,
      CODLOJA: 1,
      LOJAORIGEM: transferRequest.originId,
      LOJADESTINO: transferRequest.destinyId,
      EMISSAO: transferRequest.issue,
      HORA: new DateTime().getBRDateTime().time,
      MOTIVO: transferRequest.reason,
      USUARIO: user[0].DESCRIPTION,
      OBSERVA: transferRequest.observation,
      TIPODC: type,
      SEQUENCIA: maxCodes[0].maxSequence + 1,
      EMITIUNF: 'N',
      NOME_LOJADESTINO: transferRequest.destiny,
      NNF_TRANSFERENCIA: 0,
      D_LAN: new DateTime().getISODateTimeBr().dateTimeIso,
    }

    await TransferOfProductsModel.create(1, [transferCreate], false, connection)

    /**@type {ITransferResponse} */
    const transferResponse = {
      status: 'P',
      id: maxCodes[0].maxId + 1,
      ...transferRequest,
      user: user[0].DESCRIPTION,
      type,
      issueIso: transferRequest.issue
    }

    await this.addProducts(
      maxCodes[0].maxId + 1,
      transferResponse,
      connection
    )

    const transferOfProduct = await this.find(
      'id',
      maxCodes[0].maxId + 1,
      connection
    )

    return transferOfProduct
  }

 /**
  * @param {number} id
  * @param {ITransferResponse} transferRequest
  * @param {any} connection
  * @returns 
  */
  async addProducts(id, transferRequest, connection) {
    const transfersProducts = transferRequest.products.map( product => {
      /**@type {ITransfersProductsSce} */
      const productReturn = {
        REGISTRO: id,
        CODPRODUTO: product.id,
        QUANTIDADE: product.quantity,
        ITEM: product.item,
        UNITARIOBRUTO: product.purchasePrice,
        PERCDESCONTO: 0,
        UNITARIOLIQUIDO: product.purchasePrice,
        VALORTOTALLIQUIDO: product.quantity * product.purchasePrice,
        MU_UNIDADE: 'UN',
        MU_ITEM: -1,
        MU_QTE_MENORUN: product.quantity,
        ITEM_LOTE: 0,
      }

      return productReturn
    })

    await TransferProductModel.create(1, transfersProducts, false, connection)

    await KardexService.multiProducts(
      transfersProducts.map(product => ({
        id: product.CODPRODUTO,
        quantity: product.QUANTIDADE,
        value: product.UNITARIOBRUTO,
        balance: 0
      })),
      {
        MODULO: transferRequest.type === 'D' ? 'TRANSF LOJA SAI' : 'TRANSF LOJA ENT',
        DOC: String(id),
        OBS: transferRequest.observation,
        tipo: transferRequest.type === 'C' ? 'E' : 'S',
        USUARIO: transferRequest.user,
      },
      connection
    )

    //remover quando implementar controle de bip
    const scriptMoveStock = scriptTransferOfProducts.moveStock(
      transferRequest.type === 'C' ? 'E' : 'S',
      id,
      transferRequest.products.map(product => product.id)
    )

    await TransferProductModel._query(1, scriptMoveStock, QueryTypes.UPDATE, connection)
  }

  /**
   * @param {number} id
   * @param {number} productId
   * @param {'C' | 'D'} type
   * @param {any} connection
   */
  async rmvProduct(id, productId, type, connection){
    const scriptMoveStock = scriptTransferOfProducts.moveStock(
      type === 'D' ? 'E' : 'S',
      id,
      productId
    )

    await TransferProductModel._query(1, scriptMoveStock, QueryTypes.UPDATE, connection)

    await TransferProductModel.deleteAny(
      1,
      {
        REGISTRO: id,
        CODPRODUTO: productId
      },
      connection
    )

    await KardexService.deleteByModule({
      module: type === 'D' ? 'TRANSF LOJA SAI' : 'TRANSF LOJA ENT',
      document: String(id),
      productId,
      connection
    })
  }

 /**
  * @param {ITransferResponse} transferRequest
  * @param {number} id
  * @param {any} connection
  */
  async update(transferRequest, id, connection){
    await TransferOfProductsModel.updateAny(
      1,
      {
        EMISSAO: transferRequest.issue,
        MOTIVO: transferRequest.reason,
        OBSERVA: transferRequest.observation
      },
      {
        CODIGO: id
      },
      connection
    )

    const transferOfProduct = await this.find(
      'id',
      String(id),
      connection
    )

    return transferOfProduct[0]
  }

  /**
   * @param {number} id
   * @param {any} connection
   * @param {ITransferResponse} transferResponse
   */
  async delete(id, connection, transferResponse){
    scriptTransferOfProducts.moveStock(
      transferResponse.type === 'D' ? 'S' : 'E',
      id,
      transferResponse.products.map(product => product.id)
    )

    await TransferProductModel.deleteAny(1, {CODIGO: id}, connection)

    await TransferOfProductsModel.deleteAny(1, {REGISTRO: id}, connection)

    await KardexService.deleteByModule({
      module: transferResponse.type === 'D' ? 'TRANSF LOJA SAI' : 'TRANSF LOJA ENT',
      document: String(id),
      productId: false,
      connection
    })
  }
}

module.exports = new TransferServices()
