import React from 'react'
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@material-ui/core"
import { Delete, Edit } from "@material-ui/icons"
import { useCars } from '../../context/carsContext'

export default function TableCars({
  setValue, setIsDisableFind, setIsDisableRegister, setIsDisableUpdate, setCar
}) {
  const { cars, setCars } = useCars()

  const updateCar = car => {
    setIsDisableFind(true)
    setIsDisableRegister(true)
    setIsDisableUpdate(false)
    setValue(2)
    setCar(car)
  }
  const deleteCar = codCar => {
    try {
      if (window.confirm('Tem certeza que deseja realizar essa ação?')) {        
        setCars( cars.filter( car => car.ID !== codCar ) )
        alert('Veículo deletado com sucesso')
      }
    } catch (error) {
      alert(`Erro retornado: ${error}. Entre em contato com administrador do sistema`)
    }
  }
  return(
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Código</TableCell>
            <TableCell>Descrição</TableCell>
            <TableCell>Placa</TableCell>
            <TableCell>Modelo</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {cars.map( car => (
            <TableRow key={car.ID}>
              <TableCell>{car.ID}</TableCell>
              <TableCell>{car.DESCRIPTION}</TableCell>
              <TableCell>{car.PLATE}</TableCell>
              <TableCell>{car.MODEL}</TableCell>
              <TableCell>
                <Edit onClick={() => updateCar(car)}/>
                <Delete  onClick={() => deleteCar(car.ID)}/>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}