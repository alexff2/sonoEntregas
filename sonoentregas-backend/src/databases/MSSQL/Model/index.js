
const { QueryTypes } = require('sequelize')
const Sequelize  = require('sequelize')

const connections = require('../connections')

class Model {
  constructor(tab, columns){
    this.tab = tab,
    this.columns = columns
  }

  getObj(obj, separate=', ', toCompare = '='){
    let values = ''

    Object.entries(obj).forEach(([key,value], i, vet) => {
      if (key !== 'in') {
        let keyValue
        if (value === 'CURRENT_TIMESTAMP'){
          keyValue = toCompare === '=' ? `${key} = ${value}` : `${key} LIKE ${value}%`
        } else {
          keyValue = toCompare === '=' ? `${key} = '${value}'` : `${key} LIKE '${value}%'`
        }
  
        vet.length === i + 1 
          ? values += keyValue 
          : values += `${keyValue}${separate} `
      } else {
        Object.entries(obj.in).forEach(([keyIn,vetValueIn]) => {
          let valueIn

          vetValueIn.forEach((el, ind) => {
            ind === 0
              ? valueIn = `'${el}'`
              : valueIn += `, '${el}'`
          })

          vet.length === i + 1
            ? values += `${keyIn} IN (${valueIn.toString()})`
            : values += `${keyIn} IN (${valueIn.toString()})${separate} `
        })
      }
    })

    return values
  }

  async findAll(loja, columns = this.columns, log=false){
    const script = `SELECT ${columns} FROM ${this.tab}`

    const data = await this._query(loja, script, QueryTypes.SELECT, log)
    return data
  }
  async findSome(loja, where, columns = this.columns, log=false){
    const script = `SELECT ${columns} FROM ${this.tab} WHERE ${where}`

    const data = await this._query(loja, script, QueryTypes.SELECT, log)

    return data
  }
  async find({loja, where = {}, columns = this.columns, toCompare = '='}, log=false){
    where = Object.keys(where).length === 0 
      ? '' 
      : `WHERE ${this.getObj(where, ' AND ', toCompare)}`

    const script = `SELECT ${columns} FROM ${this.tab} ${where}`

    const data = await this._query(loja, script, QueryTypes.SELECT, log)

    return data
  }
  async findAny(loja, where = {}, columns = this.columns, log=false){
    where = Object.keys(where).length === 0 
      ? '' 
      : `WHERE ${this.getObj(where, ' AND ')}`

    const script = `SELECT ${columns} FROM ${this.tab} ${where}`

    const data = await this._query(loja, script, QueryTypes.SELECT, log)

    return data
  }

  /*async innerJoin(loja, where, ){
    const script = `SELECT ${columns} FROM ${this.tab} WHERE ${where}`

    const data = await this._query(loja, script, log)
    return data
  }*/

  async creator(loja, values, id = false, log=false) {
    //Buscando ultimo ID lançado na tabela se não fornecido
    if (!id) {
      const lastId = await this.findAll(loja, `MAX(ID) AS 'ID'`)

      const ID = lastId[0].ID ? lastId[0].ID + 1 : 1

      const script = `INSERT INTO ${this.tab} (${this.columns}) VALUES (${ID}, ${values})`

      await this._query(loja, script, QueryTypes.INSERT, log)

      const data = await this.findSome(loja, `ID = ${ID}`)

      return data[0]
    } else {
      const script = `INSERT INTO ${this.tab} (${this.columns}) VALUES (${values})`

      await this._query(loja, script, QueryTypes.INSERT, log)
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

  async creatorAny(loja, values, id = false, log=false) {
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
    await this._query(loja, script, QueryTypes.INSERT, log)

    return ID
  }

  async create(loja, values, id = false, log=false) {
    var script

    if (!id) {
      //Search first id in table
      const lastId = await this.findAll(loja, `MAX(id) AS 'id'`)

      id = lastId[0].id ? lastId[0].id + 1 : 1

      const { column, value } = this.setCreateValues(values, id)

      script = `INSERT INTO ${this.tab} (id, ${column}) VALUES ${value}`

    } else {
      const { column, value } = this.setCreateValues(values)
      
      script = `INSERT INTO ${this.tab} (${column}) VALUES ${value}`
    }
    await this._query(loja, script, QueryTypes.INSERT, log)

    const data = await this.findSome(loja, `id = ${id}`)

    return data[0]
  }
  async creatorNotReturn(loja, values, id = false, log=false) {
    //Buscando ultimo ID lançado na tabela se não fornecido
    if (!id) {
      const lastId = await this.findAll(loja, `MAX(ID) AS 'ID'`)
      
      const ID = lastId[0].ID ? lastId[0].ID + 1 : 1
      
      const script = `INSERT INTO ${this.tab} (${this.columns}) VALUES (${ID}, ${values})`
      
      await this._query(loja, script, QueryTypes.INSERT, log)
      
    } else {
      const script = `INSERT INTO ${this.tab} (${this.columns}) VALUES (${values})`
      
      await this._query(loja, script, QueryTypes.INSERT, log)
    }
  }

  async update(loja, values, id, colum = 'ID', log=false) {
    const script = `UPDATE ${this.tab} SET ${values} WHERE ${colum} = ${id}`
    
    await this._query(loja, script, QueryTypes.UPDATE, log)
    
    const data = await this.findSome(loja, `${colum} = ${id}`)
    
    return data[0]
  }
  async updateNotReturn(loja, values, id, colum = 'ID', log=false) {
    const script = `UPDATE ${this.tab} SET ${values} WHERE ${colum} = ${id}`
    
    await this._query(loja, script, QueryTypes.UPDATE, log)
  }
  async updateAny(loja, obJValues, where, log=false) {
    
    const script = `UPDATE ${this.tab} SET ${this.getObj(obJValues)} WHERE ${this.getObj(where, ' AND ')}`
    
    await this._query(loja, script, QueryTypes.UPDATE, log)
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
  
  async delete(loja, id, colum = 'ID', log=false) {
    const script = `DELETE FROM ${this.tab} WHERE ${colum} = ${id}`
    
    const data = await this._query(loja, script, QueryTypes.DELETE, log)
    
    return data
  }
  async deleteNotReturn(loja, id, colum = 'ID', log=false) {
    const script = `DELETE FROM ${this.tab} WHERE ${colum} = ${id}`
    
    await this._query(loja, script, QueryTypes.DELETE, log)
  }

  async count(loja, where = '', groupBy = '', log=false){
    const group = groupBy === '' ? groupBy : `, ${groupBy}`
    const groupby = groupBy === '' ? groupBy : `GROUP BY ${groupBy}`

    const script = `SELECT COUNT(*) AS ${this.tab}${group} FROM ${this.tab} ${where} ${groupby}`

    return await this._query(loja, script, QueryTypes.SELECT, log)
  }
  
  async _query(loja, script, type, log){
    log && console.log(script)
    const connection = connections[loja]
    const sequelize = new Sequelize(connection)

    const results = await sequelize.query(script, { type })
    return results
  }
}

module.exports = Model