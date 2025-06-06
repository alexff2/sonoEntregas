import React from 'react'
import {useReactToPrint} from 'react-to-print'
import api from '../../../services/api'

const initialState = {
  filterDialogOpen: true,
  loading: false,
  data: [],
  error: null,
}

const actionTypes = {
  OPEN_FILTER_DIALOG: 'OPEN_FILTER_DIALOG',
  CLOSE_FILTER_DIALOG: 'CLOSE_FILTER_DIALOG',
  FETCH_START: 'FETCH_START',
  FETCH_SUCCESS: 'FETCH_SUCCESS',
  FETCH_ERROR: 'FETCH_ERROR',
}

function reducer(state, action) {
  switch (action.type) {
    case actionTypes.OPEN_FILTER_DIALOG:
      return {...state, filterDialogOpen: true}
    case actionTypes.CLOSE_FILTER_DIALOG:
      return {...state, filterDialogOpen: false}
    case actionTypes.FETCH_START:
      return {...state, loading: true, error: null}
    case actionTypes.FETCH_SUCCESS:
      return {...state, loading: false, data: action.payload, filterDialogOpen: false}
    case actionTypes.FETCH_ERROR:
      return {...state, loading: false, error: action.payload}
    default:
      return state
  }
}

export default function useReport() {
  const [state, dispatch] = React.useReducer(reducer, initialState)
  const printRef = React.useRef()

  const openFilterDialog = React.useCallback(() => {
    dispatch({type: actionTypes.OPEN_FILTER_DIALOG})
  }, [])

  const closeFilterDialog = React.useCallback(() => {
    dispatch({type: actionTypes.CLOSE_FILTER_DIALOG})
  }, [])

  const fetchReportData = React.useCallback(async (date) => {
    dispatch({type: actionTypes.FETCH_START})
    try {
      const {data} = await api.get('reports/pending-products-out-of-stock', {
        params: {date},
      })

      dispatch({type: actionTypes.FETCH_SUCCESS, payload: data})
    } catch (error) {
      dispatch({type: actionTypes.FETCH_ERROR, payload: error.message || 'Erro ao buscar dados'})
    }
  }, [])

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  })

  return {
    ...state,
    openFilterDialog,
    closeFilterDialog,
    fetchReportData,
    handlePrint,
    printRef,
  }
}
