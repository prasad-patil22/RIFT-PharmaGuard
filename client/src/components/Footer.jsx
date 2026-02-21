import React from 'react';

const Footer = () => {
  return (
    <>
      <footer className="footer">
        <div className="footer-container">
          
          <div className="footer-section">
            <h2 className="footer-logo">PharmaGuard</h2>
            <p>
              Advanced pharmacogenomics risk prediction platform. 
              Empowering safer and smarter healthcare decisions.
            </p>
          </div>

          

          <div className="footer-section">
            <h3>Contact</h3>
            <p>Email: pharmaguard@gmail.com</p>
            <p>Phone: +91 63624 60082</p>
            <p>Location: India</p>
          </div>

        </div>

        <div className="footer-bottom">
          © {new Date().getFullYear()} PharmaGuard. All Rights Reserved.
        </div>
      </footer>

      <style>{`
        .footer {
          background-color: #1e293b;
          color: #f1f5f9;
          padding: 50px 20px 20px;
          font-family: Arial, sans-serif;
        }

        .footer-container {
          max-width: 1200px;
          margin: auto;
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 30px;
        }

        .footer-section {
          flex: 1;
          min-width: 250px;
        }

        .footer-logo {
          font-size: 24px;
          margin-bottom: 15px;
          color: #38bdf8;
        }

        .footer-section h3 {
          margin-bottom: 15px;
          font-size: 18px;
        }

        .footer-section p {
          margin-bottom: 10px;
          line-height: 1.6;
          font-size: 14px;
        }

        .footer-section ul {
          list-style: none;
          padding: 0;
        }

        .footer-section ul li {
          margin-bottom: 8px;
        }

        .footer-section ul li a {
          text-decoration: none;
          color: #cbd5e1;
          font-size: 14px;
          transition: color 0.3s ease;
        }

        .footer-section ul li a:hover {
          color: #38bdf8;
        }

        .footer-bottom {
          text-align: center;
          margin-top: 40px;
          padding-top: 15px;
          border-top: 1px solid #334155;
          font-size: 13px;
          color: #94a3b8;
        }

        @media (max-width: 768px) {
          .footer-container {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>
    </>
  );
};

export default Footer;
