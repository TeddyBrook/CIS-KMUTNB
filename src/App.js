import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

/* img */
import Kmutnb from './img/Kmutnb.jpg';

/* CSS */
import './App.css';

/* Component Menu */
import Menu from './components/Menu';

/* Component Register */
import Register from './components/Register';

/* Component User */
import LoginUser from './components/LoginUser';
import EditProfile from './components/EditProfile';

/* Component Admin */
import LoginAdmin from './admin/LoginAdmin';
import EditAdmin from './admin/EditAdmin';

/* Component AuthContext */
import { AuthProvider } from "./components/AuthContext";

/* Component View Document */
import View_obe3 from './components/View_obe3';
import View_obe5 from './components/View_obe5';
import View_obe7 from './components/View_obe7';

/* Component Fill Out Document */
import Fill_obe3 from './components/Fill_obe3';
import Fill_obe5 from './components/Fill_obe5';
import Fill_obe7 from './components/Fill_obe7';

/* Component ChatBot */
import Chatbot from "./components/Chatbot";

function Home() {
    return (
        <>
            <img src={Kmutnb} className="Kmutnb" alt="Kmutnb" />
        </>
    );
}

function App() {
    return (
        <>
            <AuthProvider>

                <Menu />

                <Routes>
                    {/* Home */}
                    <Route path="/" element={<Home />} />

                    {/* Register */}
                    <Route path="/Register" element={<Register />} />

                    {/* User */}
                    <Route path="/Login" element={<LoginUser />} />
                    <Route path="/EditProfile" element={<EditProfile />} />

                    {/* Admin */}
                    <Route path="/LoginAdmin" element={<LoginAdmin />} />
                    <Route path="/EditAdmin" element={<EditAdmin />} />

                    {/* View Document */}
                    <Route path="/View_obe3" element={<View_obe3 />} />
                    <Route path="/View_obe5" element={<View_obe5 />} />
                    <Route path="/View_obe7" element={<View_obe7 />} />

                    {/* Fill Out Document */}
                    <Route path="/Fill_obe3" element={<Fill_obe3 />} />
                    <Route path="/Fill_obe5" element={<Fill_obe5 />} />
                    <Route path="/Fill_obe7" element={<Fill_obe7 />} />
                </Routes>

                {/* ChatBot */}
                <Chatbot path="/Chatbot" element={<Chatbot/>}/>

            </AuthProvider>
        </>
    );
}

export default App;