const errorCath = (err, response) => {
  console.log(err)

  let status = err.status ? err.status : 400
  let error = err.error ? err.error : err

  return response.status(status).json(error)
}

module.exports = errorCath