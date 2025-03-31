
const { QueryTypes } = require('sequelize')

const connections = require('../connections')
const connectWithRetry = require('./connectWithRetry')
const getObj = require('../../../functions/getObj')

class Model {
  constructor(tab, columns){
    this.tab = tab,
    this.columns = columns
  }

  async findAll(loja, columns = this.columns, t, log=false){
    const script = `SELECT ${columns} FROM ${this.tab}`

    const data = await this._query(loja, script, QueryTypes.SELECT, t, log)
    return data
  }
  async findSome(loja, where, columns = this.columns, t, log=false){
    const script = `SELECT ${columns} FROM ${this.tab} WHERE ${where}`

    const data = await this._query(loja, script, QueryTypes.SELECT, t, log)

    return data
  }
  async find({loja, where = {}, columns = this.columns, toCompare = '='}, t, log=false){
    where = Object.keys(where).length === 0 
      ? '' 
      : `WHERE ${getObj(where, ' AND ', toCompare)}`

    const script = `SELECT ${columns} FROM ${this.tab} ${where}`

    const data = await this._query(loja, script, QueryTypes.SELECT, t, log)

    return data
  }
  async findAny(loja, where = {}, columns = this.columns, t, log=false){
    where = Object.keys(where).length === 0 
      ? '' 
      : `WHERE ${getObj(where, ' AND ')}`

    const script = `SELECT ${columns} FROM ${this.tab} ${where}`

    const data = await this._query(loja, script, QueryTypes.SELECT, t, log)

    return data
  }

  /*async innerJoin(loja, where, ){
    const script = `SELECT ${columns} FROM ${this.tab} WHERE ${where}`

    const data = await this._query(loja, script, log), t
    return data
  }*/

  async creator(loja, values, id = false, t, log=false) {
    //Buscando ultimo ID lançado na tabela se não fornecido
    if (!id) {
      const lastId = await this.findAll(loja, `MAX(ID) AS 'ID'`)

      const ID = lastId[0].ID ? lastId[0].ID + 1 : 1

      const script = `INSERT INTO ${this.tab} (${this.columns}) VALUES (${ID}, ${values})`

      await this._query(loja, script, QueryTypes.INSERT, t, log)

      const data = await this.findSome(loja, `ID = ${ID}`, '*', t)

      return data[0]
    } else {
      const script = `INSERT INTO ${this.tab} (${this.columns}) VALUES (${values})`

      await this._query(loja, script, QueryTypes.INSERT, t, log)
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

  async creatorAny(loja, values, id = false, t, log=false) {
    var script, ID

    if (!id) {
      //Search first ID in table
      const lastId = await this.findAll(loja, `MAX(ID) AS 'ID'`)

      ID = lastId[0].ID ? lastId[0].ID + 1 : 1

      const { column, value } = this.setCreateValues(values, ID)

      script = `INSERT INTO ${this.tab} (ID, ${column}) VALUES ${value}`

    } else {
      const { column, value } = this.setCreateValues(values)
      
      script = `INSERT INTO ${this.tab} (${column}) VALUES ${value}`
    }
    await this._query(loja, script, QueryTypes.INSERT, t, log)

    return ID
  }

  async create(loja, values, isThereId = true, t, log=false) {
    var script

    if (isThereId) {
      const lastId = await this.findAll(loja, `MAX(id) AS 'id'`)

      const id = lastId[0].id ? lastId[0].id + 1 : 1

      const { column, value } = this.setCreateValues(values, id)

      script = `INSERT INTO ${this.tab} (id, ${column}) VALUES ${value}`

      await this._query(loja, script, QueryTypes.INSERT, t, log)

      const data = await this.findSome(loja, `id = ${id}`, '*', t)
  
      return data[0]
    } else {
      const { column, value } = this.setCreateValues(values)
      
      script = `INSERT INTO ${this.tab} (${column}) VALUES ${value}`

      await this._query(loja, script, QueryTypes.INSERT, t, log)

      return
    }
  }
  async creatorNotReturn(loja, values, id = false, t, log=false) {
    //Buscando ultimo ID lançado na tabela se não fornecido
    if (!id) {
      const lastId = await this.findAll(loja, `MAX(ID) AS 'ID'`)
      
      const ID = lastId[0].ID ? lastId[0].ID + 1 : 1
      
      const script = `INSERT INTO ${this.tab} (${this.columns}) VALUES (${ID}, ${values})`
      
      await this._query(loja, script, QueryTypes.INSERT, t, log)
      
    } else {
      const script = `INSERT INTO ${this.tab} (${this.columns}) VALUES (${values})`
      
      await this._query(loja, script, QueryTypes.INSERT, t, log)
    }
  }

  async update(loja, values, id, colum = 'ID', t, log=false) {
    const script = `UPDATE ${this.tab} SET ${values} WHERE ${colum} = ${id}`
    
    await this._query(loja, script, QueryTypes.UPDATE, t, log)
    
    const data = await this.findSome(loja, `${colum} = ${id}`, '*', t)
    
    return data[0]
  }
  async updateNotReturn(loja, values, id, colum = 'ID', t, log=false) {
    const script = `UPDATE ${this.tab} SET ${values} WHERE ${colum} = ${id}`
    
    await this._query(loja, script, QueryTypes.UPDATE, t, log)
  }
  async updateAny(loja, obJValues, where, t, log=false) {
    
    const script = `UPDATE ${this.tab} SET ${getObj(obJValues)} WHERE ${getObj(where, ' AND ')}`
    
    await this._query(loja, script, QueryTypes.UPDATE, t, log)
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

    await this._query(loja, script, QueryTypes.UPDATE, t) */

    return obj
  }
  
  async delete(loja, id, colum = 'ID', t, log=false) {
    const script = `DELETE FROM ${this.tab} WHERE ${colum} = ${id}`
    
    const data = await this._query(loja, script, QueryTypes.DELETE, t, log)
    
    return data
  }
  async deleteNotReturn(loja, id, colum = 'ID', t, log=false) {
    const script = `DELETE FROM ${this.tab} WHERE ${colum} = ${id}`
    
    await this._query(loja, script, QueryTypes.DELETE, t, log)
  }
  async deleteAny(loja, where, t, log=false) {

    const script = `DELETE ${this.tab} WHERE ${getObj(where, ' AND ')}`

    await this._query(loja, script, QueryTypes.DELETE, t, log)
  }

  async count(loja, where = '', groupBy = '', t, log=false){
    const group = groupBy === '' ? groupBy : `, ${groupBy}`
    const groupby = groupBy === '' ? groupBy : `GROUP BY ${groupBy}`

    const script = `SELECT COUNT(*) AS ${this.tab}${group} FROM ${this.tab} ${where} ${groupby}`

    return await this._query(loja, script, QueryTypes.SELECT, t, log)
  }

  async _query(loja, script, type, t, log){
    log && console.log(script)
    const connectionConfig = connections[loja]

    if (!connectionConfig) {
      throw new Error(`Configuração de conexão para ${loja} não encontrada.`);
    }

    let sequelize;

    try {
      sequelize = await connectWithRetry(connectionConfig)
    } catch (error) {
      console.error(`Erro crítico ao conectar ao banco ${loja}:`, error.message);
      return null
    }

    let results

    if (!script) {
      const transaction = await sequelize.transaction()
      return { sequelize, transaction }
    } else if (t) {
      results = await t.sequelize.query(script, { type, transaction: t.transaction})
    } else {
      results = await sequelize.query(script, { type })
    }

    return results
  }
}

module.exports = Model