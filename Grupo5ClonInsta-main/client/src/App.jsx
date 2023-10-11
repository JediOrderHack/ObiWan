import { useState } from 'react'
import { NavLink } from 'react-router-dom';


import {Route, Routes } from 'react-router-dom';

import PrivateRoutes from './components/PrivateRoutes.jsx';

// USERS:
import Home from './pages/Home/Home.jsx';
import RegisterForm from './forms/RegisterForm/RegisterForm.jsx'
import LoginForm from './forms/LoginForm/LoginForm.jsx';
import RecoverPassword from './components/RecoverPassword.jsx';
import UpdatePassword from './components/UpdatePassword.jsx';

// ENTRIES:
import NewEntryForm from './forms/NewEntryForm/NewEntryForm.jsx';
import ValidateForm from './forms/ValidateForm/ValidateForm.jsx';
import EntryList from './components/EntryList.jsx';
import SearchBar from './components/SearchBar.jsx';
import SearchEntries from './components/SearchEntries.jsx';
import LogOut from './components/LogOut.jsx';
import AvatarPage from './pages/AvatarPage.jsx';






function App() {


  return (
  <>
      <NavLink to='/home'>Home</NavLink> {' | '}
      <NavLink to='/search/entries'>Buscar</NavLink>{' | '}
      <NavLink to='/NewEntry'>Nueva entrada</NavLink>{' | '}
      <NavLink to='/login'>Login</NavLink>{' | '}
      <NavLink to='/Register'>Register</NavLink>{' | '}
      <NavLink to='/avatar'>Avatar</NavLink>{' | '}
      <NavLink to='/Logout'>Logout</NavLink>{' | '}


    <Routes>
      <Route path='/home' element={<EntryList />}/>
      <Route path='/login' element={<LoginForm />}/>
      <Route path='/LogOut' element={<LogOut />}/>
      <Route path='/register' element={<RegisterForm />}/>
      <Route path='/forgot-password' element={<RecoverPassword />}/>
      <Route path='/update-password' element={<UpdatePassword />}/>
      <Route path='/newEntry' element={<NewEntryForm />}/>
      <Route path='/avatar' element={<AvatarPage />}/>
      <Route path='/users/validate/:id' element={<ValidateForm />}/>
      <Route path='/search/entries' element={<SearchEntries />}/>
      

    </Routes>
  </>
  )
}

export default App
