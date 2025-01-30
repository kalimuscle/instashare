import './App.css';

import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import HomePage from './pages/home';
import SignupPage from './pages/signup';
import Verify from './pages/verify';
import SignInPage from './pages/signin';
import DashboardPage from './pages/dashboard';
import PrivateRoute from './components/routes/PrivateRoute';

const App = () => {
  return (
    <BrowserRouter>
       <Routes>
        <Route index element={<HomePage />} />
        <Route path="signup" element={<SignupPage />} />
        <Route path="signin" element={<SignInPage />} />
        <Route path="verify" element={<Verify />} />

        

        <Route path="authorized">
           <Route index element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            } 
            />
             <Route path="board" element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            } 
            />
           {/* <Route path=":city" element={<City />} />
           <Route path="trending" element={<Trending />} /> */}
        </Route> 
      </Routes>
     </BrowserRouter>
  );
};

export default App;
