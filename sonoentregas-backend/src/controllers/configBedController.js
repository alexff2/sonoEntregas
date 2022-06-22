//@ts-check
const { QueryTypes } = require('sequelize')
const ConfigBeds = require('../models/tables/ConfigBeds')

/**
 * @typedef {Object} Configs
 * @property {number} ID
 * @property {string} NAME
 * @property {ConfigsBed[]} descs
 * 
 * @typedef {Object} ConfigsBed
 * @property {number} ID
 * @property {string} DESCRIPTION
 */

module.exports = {
	/**
	 * @param {*} req 
	 * @param {*} res 
	 */
	async index(req, res){
		try {
			const configs = await ConfigBeds._query(0,'SELECT ID, NAME FROM CONFIG_BED GROUP BY ID, NAME', QueryTypes.SELECT)
			
			const configBeds = await ConfigBeds.findAny(0, {}, 'ID, DESCRIPTION')
			
			//console.log(configBeds)
			configs.forEach((/** @type {Configs} */ config) => {
				config.descs = []
				configBeds.forEach((/**@type {ConfigsBed} */ configBed) => {
					config.ID === configBed.ID && config.descs.push(configBed)
				})
			})
	
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
			const { description } = req.body

			//const configBeds = await ConfigBeds.creatorAny(0, {})

			return res.json({ ID: 1, DESCRIPTION: description})
		} catch (error) {
			console.log(error)
		}
	}
}