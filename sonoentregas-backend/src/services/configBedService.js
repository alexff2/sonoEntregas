//@ts-check
const { QueryTypes } = require('sequelize')
const ConfigBeds = require('../models/tables/ConfigBeds')

/**
 * @typedef {Object} Configs
 * @property {number} ID
 * @property {string} NAME
 * @property {ConfigsBedBase[]} descs
 * 
 * @typedef {Object} ConfigsBedBase
 * @property {number} ID
 * @property {string} DESCRIPTION
 * @property {string} NAME
 */

module.exports = {
  async findConfigBed(){
    try {
			const configs = await ConfigBeds._query(0,'SELECT ID, NAME FROM CONFIG_BED WHERE ACTIVE = 1 GROUP BY ID, NAME', QueryTypes.SELECT)
			
			const configBeds = await ConfigBeds.findAny(0, { ACTIVE: 1 }, 'ID, DESCRIPTION')
			
			//console.log(configBeds)
			configs.forEach((/** @type {Configs} */ config) => {
				config.descs = []
				configBeds.forEach((/**@type {ConfigsBedBase} */ configBed) => {
					if (config.ID === configBed.ID) {
            configBed.NAME = config.NAME
            config.descs.push(configBed)
          }
				})
			})
	
			return configs
		} catch (error) {
			console.log(error)
		}
  },
  /**
   * 
   * @param {ConfigsBedBase[]} datas 
   */
  async createConfigBed(datas){
    const lastId = await ConfigBeds.findAll(0, `MAX(ID) AS 'ID'`)

    const ID = lastId[0].ID ? lastId[0].ID + 1 : 1

    datas.forEach( data => data.ID = ID)

    await ConfigBeds.creatorAny(0, datas, true)
  }
}