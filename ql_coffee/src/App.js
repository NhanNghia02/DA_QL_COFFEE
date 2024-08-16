import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

import Layout from './layouts/Layout';
import { AuthProvider, useAuth } from './model/AuthModel';
import HomeComponent from './components/HomeComponent';
import TableComponent from './components/TableComponent';
import CustomerComponent from './components/CustomerComponent';
import EmployeeComponent from './components/EmployeeComponent';
import CommentComponent from './components/CommentComponent';
import CategoryComponent from './components/CategoriesComponent';
import OrderComponent from './components/OrderComponent';
import OrderDetailComponent from './components/OrderDetailComponent';
import OrderTableComponent from './components/OrderTableComponent';
import RevenueComponent from './components/RevenueComponent';
import ProfileComponent from './components/ProfileComponent';
import MenusComponent from './components/MenusComponent';
import LoginAdminComponent from './components/LoginAdminComponent';
// import LoginComponent from './components/LoginComponent';
// import RegisterComponent from './components/RegisterComponent';
import AccountComponents from './components/AccountsComponent';

function ProtectedRoute({ element }) {
  const { currentUser } = useAuth();
  return currentUser ? element : <Navigate to="/admin/login" />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/admin/login" element={<LoginAdminComponent />} />
          {/* <Route path="/client/login" element={<LoginComponent />} />
          <Route path="/client/registers" element={<RegisterComponent />} /> */}

          <Route
            path="*"
            element={
              <Layout>
                <Routes>
                  <Route path="/" element={<ProtectedRoute element={<HomeComponent />} />} />
                  <Route path="/admin/dashboard" element={<ProtectedRoute element={<HomeComponent />} />} />
                  <Route path="/admin/table" element={<ProtectedRoute element={<TableComponent />} />} />
                  <Route path="/admin/table/:tableId" element={<ProtectedRoute element={<OrderTableComponent />} />} />
                  <Route path="/admin/customers" element={<ProtectedRoute element={<CustomerComponent />} />} />
                  <Route path="/admin/categories" element={<ProtectedRoute element={<CategoryComponent />} />} />
                  <Route path="/admin/employees" element={<ProtectedRoute element={<EmployeeComponent />} />} />
                  <Route path="/admin/orders" element={<ProtectedRoute element={<OrderComponent />} />} />
                  <Route path="/admin/orders/:orderId" element={<ProtectedRoute element={<OrderDetailComponent />} />} />
                  <Route path="/admin/comments" element={<ProtectedRoute element={<CommentComponent />} />} />
                  <Route path="/admin/accounts" element={<ProtectedRoute element={<AccountComponents />} />} />
                  <Route path="/admin/menus" element={<ProtectedRoute element={<MenusComponent />} />} />
                  <Route path="/admin/revenues" element={<ProtectedRoute element={<RevenueComponent />} />} />
                  <Route path="/admin/profile" element={<ProtectedRoute element={<ProfileComponent />} />} />
                </Routes>
              </Layout>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
