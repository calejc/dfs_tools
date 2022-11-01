import React, { useState } from 'react'
import { AppBar, Button, Container, IconButton, Menu, MenuItem, Toolbar } from '@mui/material'
import UploadIcon from '@mui/icons-material/Upload'
import { NavLink } from 'react-router-dom'
import FileUploadModal from './FileUploadModal'

export default function Navbar() {
  const [modalOpen, setModalOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState()

  const closeMenu = () => {
    setAnchorEl(null)
  }

  return <>
    <AppBar position='static' color='default' enableColorOnDark>
      <Container maxWidth='100%'>
        <Toolbar variant='dense' disableGutters>
          <Button
            size='large'
            aria-controls='nfl-menu'
            onClick={(e) => setAnchorEl(e.currentTarget)}
          >
            NFL
          </Button>
          <Menu
            id="nfl-menu"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={closeMenu}
          >
            <MenuItem onClick={closeMenu} component={NavLink} to='/lineup-builder'>Lineup Builder</MenuItem>
            <MenuItem onClick={closeMenu} component={NavLink} to='/optimizer'>Optimizer</MenuItem>
          </Menu>
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