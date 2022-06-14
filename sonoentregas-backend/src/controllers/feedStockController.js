//@ts-check
const ViewFdUnd = require('../models/views/ViewFeedUnd')
const FeedStock = require('../models/tables/FeedStock')
const FeedStockService = require('../services/FeedStockService')

module.exports = {
	/**
	 * 
	 * @param {*} req 
	 * @param {*} res 
	 * @returns 
	 */
	async index(req, res){
		try {
			const FdSk = await FeedStockService.findFeed(FeedStock)
			
			return res.json(FdSk)
		} catch (error) {
			console.log(error)
		}
	},
	/**
	 * 
	 * @param {*} req 
	 * @param {*} res 
	 */
	async find(req, res){
		try {
			const { id } = req.params
	
			const FdSk = await FeedStock.findSome(0, `ID = ${id}`)

			if (FdSk.length > 0) {
				FdSk.forEach(el => {
					el['nameClass'] = ''
				})
			}
	
			return res.json(FdSk)
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
				codSys,
				description,
				und,
				valueProd
			} = req.body

			await FeedStock.creatorAny(0, [{
				COD_SYS: codSys,
				description,
				und,
				value: valueProd
			}])

			const feed = await FeedStockService.findFeed(FeedStock)

			return res.status(201).json(feed)
		} catch (error) {
			console.log(error)
			return res.status(401).json('Erro ao cadastrar Materia Prima!')
		}
	},
	/**
	 * @param {*} req 
	 * @param {*} res 
	 */
	async findUnd(req, res){
		return res.json( await ViewFdUnd.findAll(0))
	},
	/**
	 * @param {*} req 
	 * @param {*} res 
	 */
	async searchFd(req, res){
		const { typeSearch, search } = req.params

		const feed = await FeedStock.findSome(0, `${typeSearch} LIKE '${search}%'`)

		return res.status(202).json(feed)
	}
}