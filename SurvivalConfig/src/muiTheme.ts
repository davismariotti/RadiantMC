import { createTheme, Theme } from '@mui/material/styles'

const theme = createTheme({
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
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none' },
      },
    },
  },
})

declare module '@mui/styles/defaultTheme' {
  interface DefaultTheme extends Theme {}
}

export default theme
