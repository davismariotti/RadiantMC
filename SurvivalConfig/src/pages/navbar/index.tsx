import AppBar from '@mui/material/AppBar'
import IconButton from '@mui/material/IconButton'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { HomeRounded } from '@mui/icons-material'
import React from 'react'
import { useHistory } from 'react-router'
import GithubIcon from '../../icons/GithubIcon'
import { makeStyles } from '@mui/styles'
import { Theme } from '@mui/material/styles'

const useStyles = makeStyles((theme: Theme) => ({
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}))

export default function Navbar() {
  const classes = useStyles()
  const history = useHistory()

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          edge="start"
          className={classes.menuButton}
          color="inherit"
          aria-label="menu"
          onClick={() => history.push('/')}
        >
          <HomeRounded />
        </IconButton>
        <Typography variant="h6" className={classes.title}>
          RadiantMC
        </Typography>
        <div>
          <IconButton component="a" href="https://github.com/davismariotti/RadiantMC" color="inherit">
            <GithubIcon />
          </IconButton>
        </div>
      </Toolbar>
    </AppBar>
  )
}
