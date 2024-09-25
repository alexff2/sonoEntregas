import React from 'react'
import { Container, Typography, Paper, List, ListItem, ListItemText, Divider, Box } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn'
import logo from '../../../img/SolftFlex.jpeg';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
  title: {
    marginBottom: theme.spacing(2),
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
          <List style={{ height: '220px', overflow: 'auto' }}>
            {saleReturn.products.map((product, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={product.name}
                  secondary={`Quantidade: ${product.quantity}`}
                />
              </ListItem>
            ))}
          </List>
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
          <List style={{ height: '220px', overflow: 'auto' }}>
            {saleReturn.products.map((product, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={product.name}
                  secondary={`Quantidade: ${product.quantity}`}
                />
              </ListItem>
            ))}
          </List>
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