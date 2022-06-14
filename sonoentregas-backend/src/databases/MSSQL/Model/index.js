const { QueryTypes } = require('sequelize')
const Sequelize  = require('sequelize')

const conections = require('../conections')

class Model {
  constructor(tab, coluns){
    this.tab = tab,
    this.coluns = coluns
  }

  getObj(obj, separate=', '){
    var values = ''

    Object.entries(obj).forEach(([k,v], i, vet) =>{
      vet.length === i + 1 
        ? values += `${k} = '${v}'` 
        : values += `${k} = '${v}'${separate} `
    })
  
    return values
  }

  async findAll(loja, coluns = this.coluns){
    const script = `SELECT ${coluns} FROM ${this.tab}`

    const data = await this._query(loja, script, QueryTypes.SELECT)
    return data
  }
  async findSome(loja, where, coluns = this.coluns){
    const script = `SELECT ${coluns} FROM ${this.tab} WHERE ${where}`

    const data = await this._query(loja, script, QueryTypes.SELECT)

    return data
  }
  async findAny(loja, where = {}, coluns = this.coluns){
    where = Object.keys(where).length === 0 ? '' : `WHERE ${this.getObj(where, ' AND ')}`

    const script = `SELECT ${coluns} FROM ${this.tab} ${where}`

    const data = await this._query(loja, script, QueryTypes.SELECT)

    return data
  }

  /*async innerJoin(loja, where, ){
    const script = `SELECT ${coluns} FROM ${this.tab} WHERE ${where}`

    const data = await this._query(loja, script)
    return data
  }*/

  async creator(loja, values, id = false) {
    //Buscando ultimo ID lançado na tabela se não fornecido
    if (!id) {
      const lastId = await this.findAll(loja, `MAX(ID) AS 'ID'`)

      const ID = lastId[0].ID ? lastId[0].ID + 1 : 1

      const script = `INSERT INTO ${this.tab} (${this.coluns}) VALUES (${ID}, ${values})`

      await this._query(loja, script, QueryTypes.INSERT)

      const data = await this.findSome(loja, `ID = ${ID}`)

      return data[0]
    } else {
      const script = `INSERT INTO ${this.tab} (${this.coluns}) VALUES (${values})`

      await this._query(loja, script, QueryTypes.INSERT)
    }
  }

  setCreateValues(values, id=false){
    var column, value
    values.forEach((val, index) => {
      index === 0
        ? value ='('
        : value+= ',('

      id !== false && (value += `${id + index}, `)

      Object.entries(val).forEach(([k,v], i) =>{
        if(i === 0){
          index === 0 && (column = k)
          value += `'${v}'`
        } else {
          index === 0 && (column+= `, ${k}`)
          value+= `, '${v}'`
        }  
      })  

      value+= ')'
    })
    return { column, value }
  }

  async creatorAny(loja, values, id = false) {
    var script, ID

    if (!id) {
      //Seach first ID in table
      const lastId = await this.findAll(loja, `MAX(ID) AS 'ID'`)

      ID = lastId[0].ID ? lastId[0].ID + 1 : 1

      const { column, value } = this.setCreateValues(values, ID)

      script = `INSERT INTO ${this.tab} (ID, ${column}) VALUES ${value}`

    } else {
      const { column, value } = this.setCreateValues(values)
      
      script = `INSERT INTO ${this.tab} (${column}) VALUES ${value}`
    }
    await this._query(loja, script, QueryTypes.INSERT)

    return ID
  }
  async creatorNotReturn(loja, values, id = false) {
    //Buscando ultimo ID lançado na tabela se não fornecido
    if (!id) {
      const lastId = await this.findAll(loja, `MAX(ID) AS 'ID'`)
      
      const ID = lastId[0].ID ? lastId[0].ID + 1 : 1
      
      const script = `INSERT INTO ${this.tab} (${this.coluns}) VALUES (${ID}, ${values})`
      
      await this._query(loja, script, QueryTypes.INSERT)
      
    } else {
      const script = `INSERT INTO ${this.tab} (${this.coluns}) VALUES (${values})`
      
      await this._query(loja, script, QueryTypes.INSERT)
    }
  }

  async update(loja, values, id, colum = 'ID') {
    const script = `UPDATE ${this.tab} SET ${values} WHERE ${colum} = ${id}`
    
    await this._query(loja, script, QueryTypes.UPDATE)
    
    const data = await this.findSome(loja, `${colum} = ${id}`)
    
    return data[0]
  }
  async updateNotReturn(loja, values, id, colum = 'ID') {
    const script = `UPDATE ${this.tab} SET ${values} WHERE ${colum} = ${id}`
    
    await this._query(loja, script, QueryTypes.UPDATE)
  }
  async updateAny(loja, obJValues, where) {
    
    const script = `UPDATE ${this.tab} SET ${this.getObj(obJValues)} WHERE ${this.getObj(where, ' AND ')}`
    
    await this._query(loja, script, QueryTypes.UPDATE)
  }
  updateTw() {

    //var values, where

    const obj = {
      collumns: () => {
        console.log('valores')
        return obj
      },
      cond: () => {
        console.log('where')
        return obj
      }
    }

    /* const script = `UPDATE ${this.tab} SET ${values} WHERE ${where}`

    await this._query(loja, script, QueryTypes.UPDATE) */

    return obj
  }
  
  async delete(loja, id, colum = 'ID') {
    const script = `DELETE FROM ${this.tab} WHERE ${colum} = ${id}`
    
    const data = await this._query(loja, script, QueryTypes.DELETE)
    
    return data
  }
  async deleteNotReturn(loja, id, colum = 'ID') {
    const script = `DELETE FROM ${this.tab} WHERE ${colum} = ${id}`
    
    await this._query(loja, script, QueryTypes.DELETE)
  }

  async count(loja, where = '', groupBy = ''){
    const group = groupBy === '' ? groupBy : `, ${groupBy}`
    const groupby = groupBy === '' ? groupBy : `GROUP BY ${groupBy}`

    const script = `SELECT COUNT(*) AS ${this.tab}${group} FROM ${this.tab} ${where} ${groupby}`

    return await this._query(loja, script, QueryTypes.SELECT)
  }
  
  async _query(loja, script, type){
    const conection = conections[loja]
    const sequelize = new Sequelize(conection)

    const results = await sequelize.query(script, { type })
    return results
  }
}

module.exports = Model