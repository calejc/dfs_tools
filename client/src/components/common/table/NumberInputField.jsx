import { styled, TextField } from '@mui/material'
import React from 'react'

const StyledInput = styled(TextField)({
  '& .MuiInputBase-input': {
    lineHeight: '1px!important',
    padding: '2px 4px!important',
    maxHeight: '1.35rem',
    maxWidth: '35px',
    fontSize: '0.875rem',
    textAlign: 'right'
  }
})

export default function NumberInputField({ key, value, onChange, disabled = false }) {
  return <StyledInput
    key={key}
    disabled={disabled}
    value={value}
    onChange={onChange}
    inputProps={{
      inputMode: 'numeric',
      pattern: '/^-?\d+(?:\.\d+)?$/g'
    }}
  />
}