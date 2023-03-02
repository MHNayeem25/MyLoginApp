import React from 'react';
import './App.css';
import {createBrowserRouter, RouterProvider} from 'react-router-dom'

//Import all compnonents
import Username from './components/Username'
import Register from './components/Register'
import Password from './components/Password'
import Profile from './components/Profile'
import Recovery from './components/Recovery'
import Reset from './components/Reset'
import Admin from './components/admin/Admin';

/** Auth Middleware */
import { AuthorizeUser, ProtectRoute , AuthorizeAdmin} from './middleware/auth';
//* Root routes */

const router = createBrowserRouter([
  {
    path:'/',
    element : <Username></Username>
  },
  {
    path : '/register',
    element : <Register></Register>
  },
  {
    path: '/auth/password',
    element: <ProtectRoute> <Password /> </ProtectRoute> 
  },
  {
    path: '/profile',
    element: <AuthorizeUser> <Profile /></AuthorizeUser> 
  },
  {
    path: '/recovery',
    element: <Recovery></Recovery>
  },
  {
    path: '/reset',
    element: <Reset></Reset>
  },
  {
    path: '/admin',
    element: <AuthorizeAdmin> <Admin /> </AuthorizeAdmin>
  },
  {
    //invalid route
    path: '*',
    element: <Reset></Reset>
  },
])

function App() {
  return (
    <main>
      <RouterProvider router={router}></RouterProvider>
    </main>
  );
} 

export default App;
