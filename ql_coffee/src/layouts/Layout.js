import React from 'react';
import Footer from './Footer';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

import './Layout.css';

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <Topbar />
      <div className="main-content">
        <Sidebar />
        <main className="content-area">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
