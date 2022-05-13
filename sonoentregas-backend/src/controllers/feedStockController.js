//@ts-check

const Model = require('../databases/MSSQL/Model')

class FD extends Model {
  constructor(){
    super('PROD_FEEDSTOCK', 'ID, DESCRIPTION, ID_UND, VALUE')
  }
}

const FeedStock = new FD()

module.exports = {
	/**
	 * 
	 * @param {*} req 
	 * @param {*} res 
	 * @returns 
	 */
	async index(req, res){
		try {
			const FdSk = await FeedStock.findAll(0)
			
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
	
			const FdSk = await FeedStock.findSome(0, `ìd = ${id}`)
	
			return res.json(FdSk)
		} catch (error) {
			console.log(error)
		}
	}
}