import React, {useState,useEffect} from 'react'
import {Link} from "react-router-dom";

const DashboardHeader = ({handleToggle}) => {
    const [navbar, setNavbar] = useState(false);
  
    const changeBackground = () => {
        if (window.scrollY >= 10) {
            setNavbar(true);
        } else {
            setNavbar(false);
        }
    };

    useEffect(() => {
        window.addEventListener("scroll", changeBackground);
        return () => {
            window.removeEventListener("scroll", changeBackground);
        };
    }, []);
    const handleLogout = () => {
        localStorage.removeItem('authToken');
    };
  return (
    <div><header className={`header p-4 ${navbar ? "is-sticky" : ""}`}>
    <div className="header__container px-30 sm:px-20">
        <div className='d-flex flex-row justify-content-between align-items-center'>
        <div className='d-flex flex-row gap-3'>
                <Link to="/" className="header-logo mr-20">
                    <img src="/img/general/logo-light.svg" alt="logo icon" />
                </Link>
                <button className="bg-color" onClick={handleToggle}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 20h16M4 12h16M4 4h16"></path></svg>
                </button>
            </div>
            <Link
                to="/login"
                className="button btn px-3 fw-400 text-14 border-white -outline-white h-50 text-white"
                onClick={handleLogout}
            >
                Logout
            </Link>
        </div>
    </div>
    </header></div>
  )
}

export default DashboardHeader;