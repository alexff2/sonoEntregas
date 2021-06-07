const Produtos = require('../models/ViewProdutos')

module.exports = {
  async index(req, res){
    const { typesearch, search } = req.params

    

    const produtos = await Produtos.findSome(1, `${typesearch} LIKE '${search}%'`)

    return res.json(produtos)
  }
}