import React from 'react'
import {
  Box,
  Checkbox,
  Typography,
  makeStyles
} from '@material-ui/core'
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline'

const useStyle = makeStyles(theme =>({
  root: {
    height: '82%',
    overflow: 'auto'
  },
  headerGroupProduct: {
    background: '#63818B',
    margin: '8px 8px 0px 8px',
    padding: 4,
    borderRadius: 4,
    color: 'white',
    textAlign: 'left'
  },
  boxInfo: {
    borderRadius: 4,
    width: 30,
    padding: 2,
    color: theme.palette.common.white
  }
}))

export function Products({
  data,
  productSelected,
  setProductSelected,
  beepById
}) {
  const classes = useStyle()

  const handleClickProduct = prod => {
    if (prod.quantityPedding > 0 && !beepById) {
      setProductSelected(prod)
    }

    setTimeout(() => {
      document.getElementById('beep').focus()
    }, 100)
  }

  return (
    <Box className={classes.root}>
      {
        data.map((group, i) => (
          <Box key={i}>
            <Typography className={classes.headerGroupProduct}>{group.group}</Typography>
            {
              group.products.map((prod, index) => (
                <Box key={index}>
                  <Box
                    style={{
                      display: 'flex',
                      background: `${(index % 2) === 0 ? 'white' : 'transparent'}`,
                      padding: '4px 0',
                      cursor: `${beepById ? 'default' : 'pointer'}`,
                      userSelect: `${beepById ? 'none' : 'auto'}`,
                    }}
                    onClick={() => handleClickProduct(prod)}
                  >
                    {
                      (prod.quantityPedding > 0 && !beepById) ?
                        <Checkbox
                          inputProps={{ 'aria-label': 'primary checkbox' }}
                          checked={(!!productSelected && productSelected.id === prod.id)}
                        /> :
                        <div style={{marginRight: 10}}></div>
                    }
                    <Box width='100%' marginRight={4}>
                      <Typography style={{marginBottom: 8, textAlign: 'left'}}>{prod.mask}</Typography>
                      <Box
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          width: '100%'
                        }}
                      >
                        <Box>
                          <Typography>Quantidade</Typography>
                          <Box 
                            className={classes.boxInfo}
                            style={{background: 'gray'}}
                          >{prod.quantity}</Box>
                        </Box>
                        <Box>
                          <Typography>Lido</Typography>
                          <Box 
                            className={classes.boxInfo}
                            style={{background: 'green'}}
                          >{prod.quantityBeep}</Box>
                        </Box>
                        {
                          prod.quantityPedding === 0
                          ? <CheckCircleOutlineIcon style={{fontSize: 30, color: 'green'}}/>
                          : <Box>
                              <Typography>Pedente</Typography>
                              <Box 
                                className={classes.boxInfo}
                                style={{background: 'orange'}}
                              >{prod.quantityPedding}</Box>
                            </Box>
                        }
                        
                      </Box>
                    </Box>
                  </Box>
                </Box>
              ))
            }
          </Box>
        ))
      }
    </Box>
  )
}