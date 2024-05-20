import React from 'react'
import Header from './components/Header'
import { Footer } from './components/Footer'
import  {Body}  from './components/Body'
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from "react-router-dom";
import MyAnswers from './components/MyAnswers'
import { MyQuestions}  from './components/MyQuestions'
import Signin from './components/auth/Signin';
import SignUp from './components/auth/SignUp';
import Profile from './components/Profile';
import UserProfile from './components/UserProfile';
import ForgotPassword from './components/auth/ForgotPassword';

const App = () => { 
  return (
    <BrowserRouter>

    <div className="relative">

    <Header />
    </div>
  
    <div>

    <Routes>
                
           <Route exact path='/' element={<Body />}></Route>
           <Route exact path='/Myposts' element={<MyQuestions />}></Route>
           <Route exact path='/MyAnswers' element={<MyAnswers />}></Route>
           <Route path='/sign-in' element={<Signin />} />
           <Route path='/sign-up' element={<SignUp />} />
           <Route path='/profile' element={<Profile />} />
           <Route path="/forgot-password/:email" element={<ForgotPassword />}/>
           <Route path='/userprofile/:userId' element={<UserProfile />} />

    </Routes>
    </div>
 
    </BrowserRouter>
  
  )
}

export default App
