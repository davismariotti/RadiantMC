import { ThemeProvider } from '@material-ui/styles'
import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import './App.css'
import muiTheme from './muiTheme'
import MainPage from './pages/main'
import Navbar from './pages/navbar'
import { MainContainer } from './pages/styles'
import UsernamePage from './pages/username'

function App() {
  return (
    <ThemeProvider theme={muiTheme}>
      <BrowserRouter>
        <MainContainer>
          <Navbar />
          <Route path="/" component={MainPage} exact />
          <Route path="/user/:id" component={UsernamePage} exact />
        </MainContainer>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
