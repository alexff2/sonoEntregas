import React, { createContext, useState, useContext, useEffect } from 'react'

import api from '../services/api'

const ForecastsContext = createContext()

export default function ForecastsProvider({ children }){
  const [forecasts, setForecasts] = useState([])

  useEffect(()=>{
    api
      .get('forecast')
      .then(({data}) => setForecasts(data))
  },[])

  return (
    <ForecastsContext.Provider
      value={{forecasts, setForecasts}}
    >
      {children}
    </ForecastsContext.Provider>
  )
}

export function useForecasts(){
  const {forecasts, setForecasts} = useContext(ForecastsContext)
  return {forecasts, setForecasts}
}