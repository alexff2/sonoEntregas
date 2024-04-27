//@ts-check
/**
 * @typedef {Object} ITransfers
 * @property {number} CODIGO
 * @property {number} CODLOJA
 * @property {number} LOJAORIGEM
 * @property {number} LOJADESTINO
 * @property {Date} EMISSAO
 * @property {string} HORA
 * @property {string} MOTIVO
 * @property {string} USUARIO
 * @property {string} OBSERVA
 * @property {string} TIPODC
 * @property {number} SEQUENCIA
 * @property {string} EMITIUNF
 * @property {string} NOME_LOJADESTINO
 * @property {number} NNF_TRANSFERENCIA
 * @property {string} D_LAN
 * 
 * @typedef {Object} ITransfersRequest
 * @property {Date} issue
 * @property {string} reason
 * @property {string} observation
 * @property {number} originId
 * @property {string} origin
 * @property {number} destinyId
 * @property {string} destiny
 * @property {ITransfersProducts[]} products
 * 
 * @typedef {Object} ITransfersProducts
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
 * @typedef {Object} ITransfersProductsScrip
 * @property {number} item
 * @property {number} quantity
 * @property {string} name
 * @property {number} code
 * @property {string} status
 * @property {number} transferId
 * @property {number} PCO_COMPRA
 * 
 * @typedef {Object} IProductSeries
 * @property {number} id
 * @property {number} productId
 * @property {Date} dateEntered
 * @property {number} moduleEntered
 * @property {Date} dateIsOut
 * @property {string} moduleIsOut
 * 
 * @typedef {Object} IProduct
 * @property {number} CODIGO
 * @property {number} NOME
 * @property {string} ALTERNATI
 * 
 * @typedef {Object} ITransfersProductsSeriesScrip
 * @property {number} transferId
 * @property {number} serieId
 * @property {number} productId
 */

const { QueryTypes } = require('sequelize')
const Transfer = require('../models/tables/Transfer')
const TransferProduct = require('../models/tables/Transfer/TransferProduct')
const UserModel = require('../models/Users')
const ShopsSceService = require('../services/ShopSceService')
const DateTime = require('../class/Date')

class TransferServices {
  async find(type, search) {
    const where = {
      code: { CODIGO: search },
      dateIssue: { EMISSAO: search },
    }

    const shops = await ShopsSceService.find()

    /**@type {ITransfers[]} */
    const transfers = await Transfer.findAny(1, where[type])
    
    if (transfers.length === 0) {
      return []
    }

    const script = `
    SELECT A.ITEM item, A.QUANTIDADE quantity, B.NOME name, B.CODIGO code, B.ALTERNATI generalCode, A.REGISTRO transferId
    FROM TRANSPRODLOJAI A
    INNER JOIN PRODUTOS B ON A.CODPRODUTO = B.CODIGO
    WHERE A.REGISTRO IN (${transfers.map(t => t.CODIGO)})`

    const scriptSerialsNumber = `
    SELECT A.REGISTRO transferId, A.CODPRODUTO productId, B.serieId
    FROM TRANSPRODLOJAI A
    LEFT JOIN TRANSPRODLOJAI_SERIE B ON A.REGISTRO = B.transferId AND A.CODPRODUTO = B.productId
    WHERE A.REGISTRO IN (${transfers.map(t => t.CODIGO)})`

    /**@type {ITransfersProductsScrip[]} */
    const transferProductsScrip = await TransferProduct._query(1, script, QueryTypes.SELECT)

    /**@type {ITransfersProductsSeriesScrip[]} */
    const transferProductsSerialsScrip = await TransferProduct._query(1, scriptSerialsNumber, QueryTypes.SELECT)

    const transfersMap = transfers.map(transfer => {
      const statusTransfer = transferProductsSerialsScrip.filter(serial => serial.transferId === transfer.CODIGO && serial.serieId)

      return {
        status: statusTransfer.length === 0 ? 'P' : 'B',
        code: transfer.CODIGO,
        issue: new DateTime(transfer.EMISSAO).getBRDateTime().date,
        issueIso: new DateTime(transfer.EMISSAO).getISODateTimeBr().date,
        origin: shops.filter(shop => shop.code === transfer.LOJAORIGEM)[0].name,
        originId: transfer.LOJAORIGEM,
        destiny: shops.filter(shop => shop.code === transfer.LOJADESTINO)[0].name,
        destinyId: transfer.LOJADESTINO,
        reason: transfer.MOTIVO,
        observation: transfer.OBSERVA,
        user: transfer.USUARIO,
        products: transferProductsScrip.filter(product => product.transferId === transfer.CODIGO).map(product => {
          const serialNumbers = transferProductsSerialsScrip
            .filter( serial => (serial.transferId === product.transferId && serial.productId === product.code && serial.serieId))
            .map(serial => serial.serieId)

            return {
            ...product,
          serialNumbers,
          status: serialNumbers.length < product.quantity ? 'P' : 'B'
          }
        })
      }
    })

    return transfersMap
  }

  /**
 * @param {ITransfersRequest} bodyProps 
 * @param {number} userId
 * @returns 
 */
  async create(bodyProps, userId) {
    const newCodes = await Transfer._query(1, 'SELECT MAX(CODIGO) maxId, MAX(SEQUENCIA) maxSequence FROM TRANSPRODLOJA', QueryTypes.SELECT)
    const user = await UserModel.findAny(0, { id: userId })

    await Transfer._query(1, `INSERT SEQ_TRANSPRODLOJA VALUES (${newCodes[0].maxSequence + 1}, 1)`, true)

    /**@type {ITransfers} */
    const transferCreate = {
      CODIGO: newCodes[0].maxId + 1,
      CODLOJA: 1,
      LOJAORIGEM: bodyProps.originId,
      LOJADESTINO: bodyProps.destinyId,
      EMISSAO: bodyProps.issue,
      HORA: new DateTime().getBRDateTime().time,
      MOTIVO: bodyProps.reason,
      USUARIO: user[0].DESCRIPTION,
      OBSERVA: bodyProps.observation,
      TIPODC: bodyProps.originId === 1 ? 'D' : 'C',
      SEQUENCIA: newCodes[0].maxSequence + 1,
      EMITIUNF: 'N',
      NOME_LOJADESTINO: bodyProps.destiny,
      NNF_TRANSFERENCIA: 0,
      D_LAN: new DateTime().getISODateTimeBr().dateTimeIso,
    }

    await Transfer.create(1, [transferCreate], false)

    return newCodes[0].maxId + 1
  }

  /**
   * @param {number} transferId
 * @param {ITransfersProductsScrip[]} products 
 * @returns 
 */
  async createTransferProduct(transferId, products) {
    const transfersProducts = products.map( product => {
      /**@type {ITransfersProducts} */
      const productReturn = {
        REGISTRO: transferId,
        CODPRODUTO: product.code,
        QUANTIDADE: product.quantity,
        ITEM: product.item,
        UNITARIOBRUTO: product.PCO_COMPRA,
        PERCDESCONTO: 0,
        UNITARIOLIQUIDO: product.PCO_COMPRA,
        VALORTOTALLIQUIDO: product.quantity * product.PCO_COMPRA,
        MU_UNIDADE: 'UN',
        MU_ITEM: -1,
        MU_QTE_MENORUN: product.quantity,
        ITEM_LOTE: 0,
      }

      return productReturn
    })

    await TransferProduct.create(1, transfersProducts, false)
  }

  async findProduct(type, search) {
    console.log(type)
    const script = type === 'code' 
    ? `SELECT A.CODIGO code, B.ALTERNATI generalCode, B.NOME name, A.EST_ATUAL stock, A.PCO_COMPRA, B.CBARRA barCode
      FROM PRODLOJAS A
      INNER JOIN PRODUTOS B ON A.CODIGO = B.CODIGO
      WHERE A.CODLOJA = 1 AND B.ALTERNATI LIKE '${search}%'AND B.ATIVO = 'S'`
    : `SELECT A.CODIGO code, B.ALTERNATI generalCode, B.NOME name, A.EST_ATUAL stock, A.PCO_COMPRA, B.CBARRA barCode
    FROM PRODLOJAS A
    INNER JOIN PRODUTOS B ON A.CODIGO = B.CODIGO
    WHERE A.CODLOJA = 1 AND B.NOME LIKE '${search}%'AND B.ATIVO = 'S'`

    const products = await TransferProduct._query(1, script, QueryTypes.SELECT)

    return products
  }
}

module.exports = new TransferServices()
