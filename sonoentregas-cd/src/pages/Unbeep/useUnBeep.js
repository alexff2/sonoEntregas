import { useReducer } from 'react'
import api from '../../services/api'

const OPEN_MODAL_ENTRY_NOTE = 'OPEN_MODAL_ENTRY_NOTE'
const OPEN_MODAL_ROUTE = 'OPEN_MODAL_ROUTE'
const CLOSE_MODAL = 'CLOSE_MODAL'
const UNBEEP_ENTRY_NOTE_REQUEST = 'UNBEEP_ENTRY_NOTE_REQUEST'
const UNBEEP_ROUTE_REQUEST = 'UNBEEP_ROUTE_REQUEST'

const initialState = {
  modalType: null,
  loading: false,
  error: null,
  success: false,
}

function unbeepReducer(state, action) {
  switch (action.type) {
    case OPEN_MODAL_ENTRY_NOTE:
      return { ...state, modalType: 'entry_note', error: null, success: false }
    case OPEN_MODAL_ROUTE:
      return { ...state, modalType: 'route', error: null, success: false }
    case CLOSE_MODAL:
      return { ...state, modalType: null, error: null, success: false }
    case UNBEEP_ENTRY_NOTE_REQUEST:
      return { ...state, loading: true, error: null, success: false }
    case UNBEEP_ROUTE_REQUEST:
      return { ...state, loading: true, error: null, success: false }
    case 'UNBEEP_SUCCESS':
      return { ...state, loading: false, success: true, error: null, modalType: null }
    case 'UNBEEP_ERROR':
      return { ...state, loading: false, error: action.payload, success: false }
    default:
      return state
  }
}

export function useUnbeepReducer() {
  const [state, dispatch] = useReducer(unbeepReducer, initialState)

  const openEntryNoteModal = () => dispatch({ type: OPEN_MODAL_ENTRY_NOTE })
  const openRouteModal = () => dispatch({ type: OPEN_MODAL_ROUTE })
  const closeModal = () => dispatch({ type: CLOSE_MODAL })

  const unbeepEntryNote = async ({ serialNumber }) => {
    dispatch({ type: UNBEEP_ENTRY_NOTE_REQUEST })
    try {
      await api.delete('/serial/unbeep-entry-note', { data: { serialNumber } })
      dispatch({ type: 'UNBEEP_SUCCESS' })
    } catch (err) {
      err.response.data
        ? dispatch({ type: 'UNBEEP_ERROR', payload: err.response.data })
        : dispatch({ type: 'UNBEEP_ERROR', payload: 'Erro desconhecido' })
    }
  }

  const unbeepDeliveryRoute = async ({ serialNumber }) => {
    dispatch({ type: UNBEEP_ROUTE_REQUEST })
    try {
      await api.put('/serial/unbeep-delivery-route', { serialNumber })
      dispatch({ type: 'UNBEEP_SUCCESS' })
    } catch (err) {
      err.response.data
        ? dispatch({ type: 'UNBEEP_ERROR', payload: err.response.data })
        : dispatch({ type: 'UNBEEP_ERROR', payload: 'Erro desconhecido' })
    }
  }

  return {
    state,
    openEntryNoteModal,
    openRouteModal,
    closeModal,
    unbeepEntryNote,
    unbeepDeliveryRoute,
  }
}