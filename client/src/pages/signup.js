import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router";
import toast, { Toaster } from 'react-hot-toast';
import FormSignUp from "../components/forms/formSignUp";
import api from '../api'; 

const SignupPage = () => {
  const navigate = useNavigate();

  const processRequest = async (values) => {
    const response = await api.post(`/auth/signup`, values);
    if(response.status === 201){
      navigate("/verify");
    }
  }

  const handleSignUp = async (values) => {
    try{

        toast.promise(
          async () => {
            await processRequest(values)
          },
          {
            loading: 'Creating your account...',
            success: 'Account created succesfully',
            error: 'Error creating account',
          }
        );
        
    } catch (error) {
        console.log(error)
    }
  }

  return (
    <React.Fragment>
      <div className="flex h-screen bg-gray-100">
        <header className="absolute inset-x-0 top-0 z-50">
          <nav aria-label="Global" className="flex items-center justify-between p-6 lg:px-8">
            <div className="flex lg:flex-1">
              <NavLink to="/" className="-m-1.5 p-1.5">
                <span className="sr-only">Instashare</span>
                <img
                  alt=""
                  src={"/images/mark.svg"}
                  className="h-8 w-auto"
                />
              </NavLink>
            </div>
          </nav>
        </header>
        
        <div className="hidden w-1/2 items-center justify-center bg-transparent p-8 md:flex lg:flex">
          <img
            src="/images/auth-image2.jpeg"
            alt="people buying"
            className="w-full"
          />
        </div>

        {/* Lado derecho con el formulario de inicio de sesión */}
        <div className="flex w-full items-center justify-center bg-gray-100 md:w-1/2 lg:w-1/2">
          <div className="flex  min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8">
            
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
              <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Sign up to Instashare
              </h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                Be part of this community
              </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
              <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
                <FormSignUp onSubmit={(values) => handleSignUp(values)}/>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <p className="bg-gray-100 my-4 px-2 text-gray-500">
                      Already have an account? <NavLink className="font-bold text-blue-600" to="/signin"> SignIn</NavLink>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Toaster position="top-right"/>
    </React.Fragment>
  );
};

export default SignupPage;
