import React, { useEffect, useState } from 'react'
import { Box,
  InputBase,
  makeStyles,
  Typography
} from '@material-ui/core'

import { ButtonSuccess } from '../../../components/Buttons'
import { useAlertSnackbar } from '../../../context/alertSnackbarContext'
import api from '../../../services/api'

const useStyles = makeStyles(theme => ({
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 16,
    [theme.breakpoints.up('sm')]: {
      flexDirection: 'row',
      gap: 8,
    }
  },
  fieldSearch: {
    height: '100%',
    flex: 1,
    border: '1px solid var(--gray-bold)',
    borderRadius: 4,
    paddingLeft: 8,
  }
}))

export default function UpdateId({ setOpen, noteSelected, setPurchaseNotes }){
  const [loading, setLoading] = useState(false)
  const [newId, setNewId] = useState('')
  const classe = useStyles()
  const { setAlertSnackbar } = useAlertSnackbar()

  useEffect(()=> {
    document.getElementById('newId').focus()
  })

  const updateId = async () => {
    if (Number(newId) === noteSelected.docNumber) {
      setAlertSnackbar('Novo número é igual ao antigo')
      return
    }
    setLoading(true)
    try {
        await api.put(`/purchase/notes/${noteSelected.docNumber}`, {
          newId
        })

        setPurchaseNotes(notes => notes.map(note => {
          if(note.docNumber === noteSelected.docNumber){
            note.docNumber = newId
            return note
          }

          return note
        }))

        setLoading(false)
        setOpen(false)
    } catch (error) {
      console.log(error)
      if (error.response?.data === 'It already exists') {
        setAlertSnackbar('Já existe Nota com essa numeração')
      } else setAlertSnackbar('Não foi possível atualizar, entre em contato com ADM!')
      setLoading(false)
      setOpen(false)
    }
  }

  const changeId = e => {
    if(isNaN(Number(e.target.value))) return

    setNewId(e.target.value)
  }

  return(
    <>
      <Typography
        variant='subtitle1'
        align='center'
      >
        {noteSelected.docNumber}
      </Typography>

      <Box className={classe.content}>
        <InputBase
          id='newId'
          className={classe.fieldSearch}
          value={newId}
          onChange={changeId}
          onKeyDown={e => e.key === 'Enter' && updateId()}
        />

        <ButtonSuccess
          onClick={updateId}
          loading={loading}
          stylesInComponent={{
            marginRight: 0
          }}
        >
          ATUALIZAR
        </ButtonSuccess>
      </Box>
    </>
  )
}