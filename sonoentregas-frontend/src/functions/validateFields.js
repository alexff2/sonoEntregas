function validateFields(field) {
  for (let i = 0; i < field.length; i++) {
    if (!field[i] || field[i] === "") {
      return false
    }
  }
  return true
}

function validateObs(obs, have_obs2) {
  if(!have_obs2){
    return true
  } else if (validateFields([obs])) {
    return true
  } else {
    return false
  }
}

export {
  validateFields, validateObs
}
