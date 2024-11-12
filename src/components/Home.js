import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
const Home = () => {
  const [navbar, setNavbar] = useState(window.scrollY >= 10);
  const changeBackground = () => setNavbar(window.scrollY >= 10);

  useEffect(() => {
    window.addEventListener("scroll", changeBackground);
    return () => {
      window.removeEventListener("scroll", changeBackground);
    };
  }, []);
  const [tokenExpired, setTokenExpired] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now();
      if (decodedToken.exp * 1000 < currentTime) {
        console.log("Token has expired. Removing from localStorage.");
        setTokenExpired(true);
        localStorage.removeItem("authToken");
      } else {
        setTokenExpired(false);
        const timeDifference =
          (decodedToken.exp * 1000 - currentTime) / (1000 * 3600);
        console.log("Token expires in", timeDifference, "hours.");
      }
    } else {
      setTokenExpired(true);
    }
  }, []);

  return (
    <>
      <div className="header-margin"></div>
      <header className={`header p-4 ${navbar ? "is-sticky" : ""}`}>
        <div className="header__container px-30 sm:px-20">
          <div className="d-flex flex-row justify-content-between align-items-center">
            <Link to="/" className="header-logo mr-20">
              <img src="/img/general/logo-light.svg" alt="logo icon" />
            </Link>

            {tokenExpired ? (
              <Link
                to="/login"
                className="button btn px-3 fw-400 text-14 border-white -outline-white h-50 text-white"
              >
                Login
              </Link>
            ) : (
              <Link
                to="/events"
                className="button btn px-3 fw-400 text-14 border-white -outline-white h-50 text-white"
              >
                Expo Race Dashboard
              </Link>
            )}
          </div>
        </div>
      </header>
      <div className=""></div>
    </>
  );
};

export default Home;
