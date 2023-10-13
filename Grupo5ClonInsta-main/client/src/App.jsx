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
import LogOut from './components/LogOut.jsx';
import PrivateProfileCard from './components/PrivateProfileCard.jsx';
import ProfileButton from './components/ProfileButton.jsx';
import AvatarEditor from './forms/AvatarForm/AvatarForm.jsx';







function App() {


  return (
    <>
      <NavLink to="/home">Home</NavLink> {" | "}

      <NavLink to="/NewEntry">Nueva entrada</NavLink>
      {" | "}
      <NavLink to="/login">Login</NavLink>
      {" | "}
      <NavLink to="/Register">Register</NavLink>
      {" | "}
      <NavLink to="/avatar">Avatar</NavLink>
      {" | "}
      <NavLink to="/Logout">Logout</NavLink>
      {" | "}
      <NavLink to="/perfil"><ProfileButton/></NavLink>
      

      <Routes>
        <Route path="/home" element={<EntryList />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/LogOut" element={<LogOut />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/forgot-password" element={<RecoverPassword />} />
        <Route path="/update-password" element={<UpdatePassword />} />
        <Route path="/newEntry" element={<NewEntryForm />} />
        <Route path="/avatar" element={<AvatarEditor />} />
        <Route path="/users/validate/:regCode" element={<ValidateForm />} />
        <Route path="/perfil" element={<PrivateProfileCard />} />
      </Routes>
    </>
  );
}

export default App
