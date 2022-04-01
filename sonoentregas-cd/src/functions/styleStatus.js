const StyleStatus = status => {
  var background
  if (status === 'Em lançamento') {
    background = '#2196f3'
  } else if (status === 'Entregando' || status === 'Em deslocamento') {
    background = '#ff9800'
  } else if (status === 'Finalizada') {
    background = '#388e3c'
  }
  return { 
    background,
    color: '#FFF',
    width: '100%',
    minHeight: '1.5rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer'
  }
}

export default StyleStatus