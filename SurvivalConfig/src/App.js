import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import './App.css'
import MainPage from './pages/main'
import UsernamePage from './pages/username'
import Navbar from './pages/navbar'
import { MainContainer } from './pages/styles'

function App() {
  return (
    <BrowserRouter>
      <MainContainer>
        <Navbar />
        <Route path="/" component={MainPage} exact />
        <Route path="/username/:username" component={UsernamePage} exact />
      </MainContainer>
    </BrowserRouter>
  )
}

export default App
