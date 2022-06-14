//@ts-check
const ProductsService = require('../services/ProductsService')
const Products = require('../models/tables/Product')
const ProdFeedStock = require('../models/tables/ProdFeedStock')
const FeedStock = require('../models/tables/FeedStock')
const ViewProdFeed = require('../models/views/ViewProdFeed')

module.exports = {
	/**
	 * @param {*} req 
	 * @param {*} res 
	 * @returns 
	 */
	async index(req, res){
		try {
			const Prod = await ProductsService.findProd()
			
			return res.json(Prod)
		} catch (error) {
			console.log(error)
		}
	},
	/**
	 * @param {*} req 
	 * @param {*} res 
	 */
	async find(req, res){
		try {
			const { id } = req.params
	
			const Prod = await Products.findSome(0, `ID = ${id}`)

      const prodFeed = await ViewProdFeed.findAny(0, {ID: Prod[0].ID})

      if (Prod.length > 0) {
        Prod.forEach((/** @type {{ [x: string]: string; }} */ el) => {
          el['prodsFeed'] = prodFeed
          
          el['nameClass'] = ''
				})
			}
	
			return res.json(Prod)
		} catch (error) {
			console.log(error)
		}
	},
	/**
	 * @param {*} req 
	 * @param {*} res 
	 */
	async create(req, res){
		try {
			const {
				description,
        expense,
				valueProd,
        prodsFeed
			} = req.body

      const prodsFeedCreat = []
      
      const prodId = await Products.creatorAny(0, [{
        description,
        expense,
        value: valueProd
      }])

      prodsFeed.forEach( pf => {
        prodsFeedCreat.push({
          ID: prodId,
          ID_FEED: pf.ID_FEED
        })
      })

      await ProdFeedStock.creatorAny(0, prodsFeedCreat, true)

			return res.status(201).json({msg: 'Cadastrado com sucesso!'})
		} catch (error) {
			console.log(error)
			return res.status(401).json('Erro ao cadastrar Produto!')
		}
	},
	/**
	 * @param {*} req 
	 * @param {*} res 
	 */
	async searchProd(req, res){
		const { typeSearch, search } = req.params
    console.log('teste')

    try {
      const prod = await Products.findSome(0, `${typeSearch} LIKE '${search}%'`)

      return res.status(202).json(prod)
    } catch (error) {
      console.log(error)
      return res.status(400).json('Erro ao buscar produto')
    }
	},
	/**
	 * @param {*} req 
	 * @param {*} res 
	 */
	async searchFeedToCreate(req, res){
		const { id } = req.params

    try {
      const prod = await FeedStock.findAny(0, { id })
      prod[0]['ID_FEED'] = prod[0].ID

      return res.status(202).json(prod)
    } catch (error) {
      console.log(error)
      return res.status(400).json('Erro ao buscar produto')
    }
	}
}