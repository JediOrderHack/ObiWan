import { useState } from 'react'
import { NavLink } from 'react-router-dom';


import {Route, Routes } from 'react-router-dom';

import PrivateRoutes from './components/PrivateRoutes.jsx';

// USERS:

import RegisterForm from './forms/RegisterForm/RegisterForm.jsx'
import LoginForm from './forms/LoginForm/LoginForm.jsx';
import RecoverPassword from './components/RecoverPassword.jsx';
import UpdatePassword from './components/UpdatePassword.jsx';

// ENTRIES:
import NewEntryForm from './forms/NewEntryForm/NewEntryForm.jsx';
import AvatarForm from './forms/AvatarForm/AvatarForm.jsx';
import ValidateForm from './forms/ValidateForm/ValidateForm.jsx';
import EntryList from './components/EntryList.jsx';
import EditEntryPage from './pages/EditEntry.jsx';




function App() {


  return (
  <>
      <NavLink to='/home'>Home</NavLink> {' | '}
      <NavLink to='/NewEntry'>Nueva entrada</NavLink>{' | '}
      <NavLink to='/login'>Login</NavLink>{' | '}
      <NavLink to='/Register'>Register</NavLink>{' | '}
      <NavLink to='/avatar'>Avatar</NavLink>{' | '}

    <Routes>
      <Route path='/home' element={<EntryList />}/>
      <Route path='/login' element={<LoginForm />}/>
      <Route path='/register' element={<RegisterForm />}/>
      <Route path='/forgot-password' element={<RecoverPassword />}/>
      <Route path='/update-password' element={<UpdatePassword />}/>
      <Route path='/newEntry' element={<NewEntryForm />}/>
      <Route path='/:id/editEntry' element={<EditEntryPage/>}/>
      <Route path='/avatar' element={<AvatarForm />}/>
      <Route path='/users/validate/:id' element={<ValidateForm />}/>

    </Routes>
  </>
  )
}

export default App
