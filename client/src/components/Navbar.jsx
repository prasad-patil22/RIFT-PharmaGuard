import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {

  Activity,
} from "lucide-react";

const Navbar = () => {





  return (
    <>
      <style>{`
        .navbar {
          position: sticky;
          top: 0;
          z-index: 1000;
          background: #ffffff;
          box-shadow: 0 4px 18px rgba(0,0,0,0.06);
        }

        .nav-container {
          max-width: 1200px;
          margin: auto;
          padding: 0 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 70px;


          
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
        }

        .brand-logo {
          width: 42px;
          height: 42px;
          background: #1e293b;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          color: white;
        }

        .brand-text h1 {
          font-size: 18px;
          margin: 0;
          color: #1e293b;
        }

        .brand-text span {
          font-size: 12px;
          color: #6B7280;
        }

        .nav-links {
          display: flex;
          gap: 18px;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border-radius: 8px;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          color: #374151;
          transition: all 0.25s ease;
        }

        .nav-link:hover {
          background: #F3F4F6;
        }

        .nav-link.active {
          background: #E3F2FD;
          color: #1976D2;
        }

        .nav-link.highlight {
          background: #1976D2;
          color: white;
          box-shadow: 0 4px 12px rgba(25,118,210,0.3);
        }

        .auth-buttons {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .btn {
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          border: none;
          transition: all 0.25s ease;
        }

        .btn-login {
          background: transparent;
          border: 1px solid #E5E7EB;
          color: #1976D2;
        }

        .btn-signup {
          background: #1976D2;
          color: white;
          box-shadow: 0 4px 10px rgba(25,118,210,0.25);
        }

        .btn-logout {
          background: #C62828;
          color: white;
        }

        .mobile-toggle {
          display: none;
          cursor: pointer;
        }

        .mobile-menu {
          display: none;
          flex-direction: column;
          padding: 16px 24px;
          border-top: 1px solid #E5E7EB;
          background: #ffffff;
        }

        .mobile-menu a {
          padding: 10px 0;
          text-decoration: none;
          color: #374151;
        }

       
      `}</style>

      <nav className="navbar">
        <div className="nav-container">
          <Link to="/" className="brand">
            <div className="brand-logo">
              <Activity size={22} />
            </div>
            <div className="brand-text">
              <h1>PharmaGuard</h1>
              <span>Clinical Pro</span>
            </div>
          </Link>
        </div>

        
      </nav>
    </>
  );
};

export default Navbar;
