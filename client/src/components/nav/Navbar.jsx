import React, { useState } from 'react'
import { AppBar, Container, IconButton, Toolbar } from '@mui/material'
import UploadIcon from '@mui/icons-material/Upload'
import FileUploadModal from './FileUploadModal'

export default function Navbar() {
  const [modalOpen, setModalOpen] = useState(false)

  return <>
    <AppBar position='static' color='default'>
      <Container maxWidth='100%'>
        <Toolbar variant='dense' disableGutters>
          <IconButton
            sx={{ marginRight: '10px', marginLeft: 'auto' }}
            onClick={() => setModalOpen(true)}
          >
            <UploadIcon />
          </IconButton>
        </Toolbar>
      </Container>
    </AppBar>
    <FileUploadModal
      open={modalOpen}
      onClose={() => setModalOpen(false)}
    />
  </>
}