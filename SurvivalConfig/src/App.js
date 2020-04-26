import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import './App.css'
import MainPage from './pages/main'
import MobileEditor from './pages/mobile'
import Navbar from './pages/navbar'
import { MainContainer } from './pages/styles'

function App() {
  return (
    <BrowserRouter>
      <MainContainer>
        <Navbar />
        <Route path="/" component={MainPage} exact />
        <Route path="/mobile/:mobile" component={MobileEditor} exact />
      </MainContainer>
    </BrowserRouter>
  )
}

export default App
