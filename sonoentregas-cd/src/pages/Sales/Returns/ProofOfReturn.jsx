import React from 'react'
import { Container, Typography, Paper, Divider, Box } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn'
import logo from '../../../img/SolftFlex.jpeg';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
  title: {
    marginBottom: theme.spacing(0),
  },
  signature: {
    marginTop: theme.spacing(2),
    textAlign: 'center',
  },
  icon: {
    verticalAlign: 'middle',
    marginRight: theme.spacing(1),
  },
}));

const ProofOfReturn = ({ saleReturn }) => {
  const classes = useStyles();

  return (
    <Box className="report">
      <Container style={{ position: 'relative' }}>
        <Paper className={classes.root} style={{ position: 'relative', zIndex: 1 }}>
          <Typography variant="h5" className={classes.title}>
            <AssignmentTurnedInIcon className={classes.icon} />
            Comprovante da Devolução Nº {saleReturn.id}
          </Typography>
          <Typography variant="subtitle1">
            <strong>Cliente</strong>: {saleReturn.client}
          </Typography>
          <Typography variant="subtitle1">
            <strong>Endereço</strong>: {`${saleReturn.street} Nº ${saleReturn.houseNumber}, ${saleReturn.district}, ${saleReturn.city} - ${saleReturn.state}`}
          </Typography>
          <Typography variant="subtitle1">
            <strong>Telefone</strong>: {saleReturn.phone}
          </Typography>
          <Divider />
          <div style={{padding: '8px 0'}}>
            {saleReturn.products.map((product, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 4
                }}
              >
                <div style={{
                  fontWeight: 'bold'
                }}>{product.name}</div>
                <div>{`Quantidade: ${product.quantity}`}</div>
              </div>
            ))}
          </div>
          <Divider />
          <div className={classes.signature}>
            <Typography variant="body1">
              Eu, {saleReturn.client}, estou devolvendo o(s) produto(s) acima listado(s).
            </Typography>
            <Typography variant="body2" style={{marginTop: 20}}>
              ____________________________________________________________________________
            </Typography>
            <Typography variant="body2">
              Assinatura Cliente
            </Typography>
          </div>
        </Paper>
        <Box
          component="img"
          src={logo}
          alt="Logo"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            opacity: 0.1,
            width: '80%',
            zIndex: 1,
          }}
        />
      </Container>
      <Container style={{ position: 'relative' }}>
        <Paper className={classes.root} style={{ position: 'relative', zIndex: 1 }}>
          <Typography variant="h5" className={classes.title}>
            <AssignmentTurnedInIcon className={classes.icon} />
            Comprovante da Devolução Nº {saleReturn.id}
          </Typography>
          <Typography variant="subtitle1">
            <strong>Cliente</strong>: {saleReturn.client}
          </Typography>
          <Typography variant="subtitle1">
            <strong>Endereço</strong>: {`${saleReturn.street} Nº ${saleReturn.houseNumber}, ${saleReturn.district}, ${saleReturn.city} - ${saleReturn.state}`}
          </Typography>
          <Typography variant="subtitle1">
            <strong>Telefone</strong>: {saleReturn.phone}
          </Typography>
          <Divider />
          <div style={{padding: '8px 0'}}>
            {saleReturn.products.map((product, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 4
                }}
              >
                <div style={{
                  fontWeight: 'bold'
                }}>{product.name}</div>
                <div>{`Quantidade: ${product.quantity}`}</div>
              </div>
            ))}
          </div>
          <Divider />
          <div className={classes.signature}>
            <Typography variant="body1">
              Eu, {saleReturn.client}, estou devolvendo o(s) produto(s) acima listado(s).
            </Typography>
            <Typography variant="body2" style={{marginTop: 20}}>
              ____________________________________________________________________________
            </Typography>
            <Typography variant="body2">
              Assinatura Aux. de Entrega
            </Typography>
          </div>
        </Paper>
        <Box
          component="img"
          src={logo}
          alt="Logo"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            opacity: 0.1,
            width: '80%',
            zIndex: 1,
          }}
        />
      </Container>
    </Box>
  );
};

export default ProofOfReturn;