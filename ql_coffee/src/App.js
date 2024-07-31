import React from 'react';
import './App.css';
import Layout from './layouts/Layout';

function App() {
  return (
    <Layout> 
      <h2>Chào mừng bạn đến quán Coffee 18</h2>
      <p>Xin hãy chọn thực đơn bạn mong muốn</p>
      <button className='btn btn-danger'>Thêm</button>
    </Layout>
  );
}

export default App;
