import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { NotFound } from './pages/NotFound';
import { VerifyMail } from './pages/VerifyMail';
import { ChangePassword } from './pages/ChangePassword';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='' element={<Landing />}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/register' element={<Register />}></Route>
        <Route path='/verify-mail' element={<VerifyMail />}></Route>
        <Route path='/change-password' element={<ChangePassword />}></Route>
        <Route path='*' element={<NotFound />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
