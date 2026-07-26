import { useState,useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import { Outlet } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import {login,logout} from "./store/authslice"
import Header from "./components/Header/Header"
import Footer from "./components/footer/Footer"
import authService from './appwrite/auth'
import Logo from './components/Logo'
import ScrollTop from './scroll/scrollTop'

function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

useEffect(()=>{
  authService
      .getCurrentUser()
      .then((userData)=>{
        if(userData) {
          const safeUserData = JSON.parse(JSON.stringify(userData))
          dispatch(login({userData: safeUserData}))
        }
        else {dispatch(logout())
        };
      })
      .finally(()=>setLoading(false));
},[dispatch])

  return !loading? (
    
     <div className='min-h-screen flex flex-wrap content-between bg-gray-400'>
      <ScrollTop/>
      <div className='w-full block'>
        <Header/>
        <main>
          <Outlet/>
        </main>
      </div>
      <div className="w-full block">
          <Footer/>  
      </div>
     </div>
    
  ):null;
}

export default App
