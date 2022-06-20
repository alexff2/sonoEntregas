//@ts-check
const BedsService = require('../services/BedService')
const Beds = require('../models/tables/Bed')
const BedFeedStock = require('../models/tables/BedFeedStock')
const FeedStock = require('../models/tables/FeedStock')
const ViewBedFeed = require('../models/views/ViewBedFeed')

module.exports = {
	/**
	 * @param {*} req 
	 * @param {*} res 
	 * @returns 
	 */
	async index(req, res){
		try {
			const beds = await BedsService.findBed()
			
			return res.json(beds)
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
	
			const Prod = await Beds.findSome(0, `ID = ${id}`)

      const prodFeed = await ViewBedFeed.findAny(0, {ID: Prod[0].ID})

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
      
      const prodId = await Beds.creatorAny(0, [{
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

      await BedFeedStock.creatorAny(0, prodsFeedCreat, true)

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
      const prod = await Beds.findSome(0, `${typeSearch} LIKE '${search}%'`)

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