import React, {useEffect} from 'react'
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@material-ui/core"
import { Edit } from "@material-ui/icons"
import { useCars } from '../../context/carsContext'
import api from '../../services/api'

export default function TableCars({
  setValue, setIsDisableFind, setIsDisableRegister, setIsDisableUpdate, setCar
}) {
  const { cars, setCars } = useCars()

  useEffect(() => {
    api.get('cars')
      .then(({data}) => {
        setCars(data)
      })
  }, [setCars])

  const updateCar = car => {
    setIsDisableFind(true)
    setIsDisableRegister(true)
    setIsDisableUpdate(false)
    setValue(2)
    setCar(car)
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}