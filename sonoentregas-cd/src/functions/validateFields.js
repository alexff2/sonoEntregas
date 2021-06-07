export default function validateFilds(field) {
  for (let i = 0; i < field.length; i++) {
    if (!field[i] || field[i] === "") {
      return false
    }
  }
  return true
}