import { createMuiTheme } from '@material-ui/core/styles'

const theme = createMuiTheme({
  palette: {
    error: {
      light: '#ff967c',
      main: '#f1654f',
      dark: '#b93325',
    },
    success: {
      light: '#79eaa1',
      main: '#43b772',
      dark: '#008646',
    },
    warning: {
      light: '#ffff84',
      main: '#ffd452',
      dark: '#c8a31b',
    },
    info: {
      light: '#81c4ff',
      main: '#4194fb',
      dark: '#0067c7',
    },
  },
  breakpoints: {
    values: {
      md: 1024,
      lg: 1440,
      xl: 1660,
    },
  },
})

theme.overrides = {
  ...theme.overrides,
  MuiButton: {
    root: {
      textTransform: 'none',
    },
  },
}

export default theme
