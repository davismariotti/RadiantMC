import { ThemeProvider } from '@mui/material/styles'
import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import './App.css'
import muiTheme from './muiTheme'
import MainPage from './pages/main'
import Navbar from './pages/navbar'
import UsernamePage from './pages/username'
import { CssBaseline, StyledEngineProvider } from '@mui/material'

function App() {
  return (
    <React.Fragment>
      <StyledEngineProvider injectFirst>
        <CssBaseline />
        <ThemeProvider theme={muiTheme}>
          <BrowserRouter>
            <div style={{width: '100%',height: '100%', minHeight: '100vh'}}>
              <Navbar />
              <Route path="/" component={MainPage} exact />
              <Route path="/user/:id" component={UsernamePage} exact />
            </div>
          </BrowserRouter>
        </ThemeProvider>
      </StyledEngineProvider>
    </React.Fragment>
  )
}

export default App
