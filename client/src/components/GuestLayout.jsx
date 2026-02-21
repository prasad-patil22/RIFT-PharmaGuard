import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const GuestLayout = ({ 
  showFooter = true,
  maxWidth = '7xl',
  padding = true,
  className = ''
}) => {
  const maxWidthClasses = {
    '7xl': 'max-w-7xl',
    '6xl': 'max-w-6xl',
    '5xl': 'max-w-5xl',
    '4xl': 'max-w-4xl',
    '3xl': 'max-w-3xl',
    '2xl': 'max-w-2xl',
    'xl': 'max-w-xl',
    'lg': 'max-w-lg',
    'md': 'max-w-md',
    'sm': 'max-w-sm',
    'full': 'max-w-full',
    'none': '',
  };

  const paddingClasses = padding ? 'px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10' : '';

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: '#F4F7FA' }}>
      {/* Navbar */}
      {/* <Navbar /> */}

      {/* Main Content with Outlet */}
      <main className={`flex-grow mx-auto w-full ${maxWidthClasses[maxWidth]} ${paddingClasses} ${className}`}>
        <div 
          className="bg-white rounded-xl shadow-sm p-6 h-full"
          style={{ 
            boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
            borderRadius: '16px'
          }}
        >
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      {showFooter && <Footer />}
    </div>
  );
};

export default GuestLayout;