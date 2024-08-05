import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Layout from './layouts/Layout';
import HomeComponent from './components/HomeComponent';
import TableComponent from './components/TableComponent';
import CustomerComponent from './components/CustomerComponent';
import EmployeeComponent from './components/EmployeeComponent';
import CommentComponent from './components/CommentComponent';
import QuestionComponent from './components/QuestionComponent';
import OrderComponent from './components/OrderComponent';
import LoginComponent from './components/LoginComponent';
import RegisterComponent from './components/RegisterComponent';
import ProfileComponent from './components/ProfileComponent';
<<<<<<< Updated upstream
=======
import MenusComponent from './components/MenusComponent';
import RevenueComponent from './components/RevennuComponent';
>>>>>>> Stashed changes

function App() {
  return (
    <Router>
<<<<<<< Updated upstream
      <div className="app-container">
        <Layout>
          <main>
            <Routes>
              <Route path="/" element={<HomeComponent />} />
              <Route path="/admin" element={<HomeComponent />} />
              <Route path="/admin/table" element={<TableComponent />} />
              <Route path="/admin/customers" element={<CustomerComponent />} />
              <Route path="/admin/employees" element={<EmployeeComponent />} />
              <Route path="/admin/orders" element={<OrderComponent />} />
              <Route path="/admin/comments" element={<CommentComponent />} />
              <Route path="/admin/questions" element={<QuestionComponent />} />
              
                <Route path="/" element={<TableComponent />} />
                <Route path="/order" element={<OrderComponent />} />
            
            </Routes>
          </main>
        </Layout>
      </div>
=======
      <Routes>
        <Route path="/admin/logins" element={<LoginComponent />} />
        <Route path="/admin/registers" element={<RegisterComponent />} />
        
        <Route
          path="*"
          element={
            <Layout>
              <Routes>
                <Route path="/" element={<HomeComponent />} />
                <Route path="/admin/dashboard" element={<HomeComponent />} />
                <Route path="/admin/table" element={<TableComponent />} />
                <Route path="/admin/customers" element={<CustomerComponent />} />
                <Route path="/admin/employees" element={<EmployeeComponent />} />
                <Route path="/admin/orders" element={<OrderComponent />} />
                <Route path="/admin/comments" element={<CommentComponent />} />
                <Route path="/admin/questions" element={<QuestionComponent />} />
                <Route path="/admin/menus" element={<MenusComponent />} />
                <Route path="/admin/profile" element={<ProfileComponent />} />
                <Route path="/admin/revenues" element={<RevenueComponent />} />

              </Routes>
            </Layout>
          }
        />
      </Routes>
>>>>>>> Stashed changes
    </Router>
  );
}

export default App;
