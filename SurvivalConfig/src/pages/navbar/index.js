import AppBar from '@material-ui/core/AppBar'
import IconButton from '@material-ui/core/IconButton'
import { makeStyles } from '@material-ui/core/styles'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import { HomeRounded } from '@material-ui/icons'
import React from 'react'
import { useHistory } from 'react-router'
import GithubIcon from '../../icons/GithubIcon'

const useStyles = makeStyles(theme => ({
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
