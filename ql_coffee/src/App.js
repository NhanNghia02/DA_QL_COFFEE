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

function App() {
  return (
    <Router>
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

            </Routes>
          </main>
        </Layout>
      </div>
    </Router>
  );
}

export default App;
