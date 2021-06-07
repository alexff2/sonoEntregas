
module.exports = [
  {
    database: "SONOENTREGAS", 
    username: "SUPERSCERG", 
    password: "S35SUP5RSRG",
    host: "174.200.200.41",
    port: 1433,
    dialect: "mssql",
    dialectOptions: {
      options: { encrypt: false }
    }
  },
  {
    database: "SONO", 
    username: "SUPERSCERG", 
    password: "S35SUP5RSRG",
    host: "localhost",
    port: 1433,
    dialect: "mssql",
    dialectOptions: {
      options: { encrypt: false }
    }
  },
  {
    database: "SONO_JP1", 
    username: "SUPERSCERG", 
    password: "S35SUP5RSRG",
    host: "174.200.201.12",
    port: 1433,
    dialect: "mssql",
    dialectOptions: {
      options: { encrypt: false }
    }
  },
  {
    database: "SONO_JP2", 
    username: "SUPERSCERG", 
    password: "S35SUP5RSRG",
    host: "174.200.201.101",
    port: 1433,
    dialect: "mssql",
    dialectOptions: {
      options: { encrypt: false }
    },
    logging: false
  }
]