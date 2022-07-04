//@ts-check
const ConfigBeds = require('../models/tables/ConfigBeds')
const configBedServices = require('../services/configBedService')

module.exports = {
	/**
	 * @param {*} req 
	 * @param {*} res 
	 */
	async index(req, res){
		try {
			const configs = await configBedServices.findConfigBed()
	
			return res.json(configs)
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
			const configBad = req.body

			await configBedServices.createConfigBed(configBad)

			const configs = await configBedServices.findConfigBed()

			return res.json(configs)
		} catch (error) {
			console.log(error)
		}
	},
	/**
	 * @param {*} req 
	 * @param {*} res 
	 */
	async inactivate(req, res) {
		try {
			const { ID } = req.body

			await ConfigBeds.updateAny(0, { ACTIVE: 0 }, { ID })

			const configs = await configBedServices.findConfigBed()
	
			return res.json(configs)
		} catch (error) {
			console.log(error)
		}
	}
}