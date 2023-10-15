
import "./App.css";

import {Route, Routes } from 'react-router-dom';



// USERS:

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

import PublicProfileCard from './components/PublicProfileCard.jsx';
import EditEntryForm from './forms/EditEntryForm/EditEntryForm.jsx';
import AvatarEditor from './forms/AvatarForm/AvatarForm.jsx';

import NavBar from './components/NavBar/NavBar.jsx';







function App() {


  return (
    <>
      <NavBar />


      <Routes classname="app">
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
        <Route path="/perfil-publico/:userId" element={<PublicProfileCard />} />
        <Route path="/editEntry/:entryId" element={<EditEntryForm />} />
      </Routes>
      <footer>Made with ♥️</footer>
    </>
  );
}

export default App
