import "bootstrap/dist/css/bootstrap.min.css";
import { Route, Routes, Link } from "react-router-dom";

import "./App.css";

import GoogleAuth from "./GoogleAuth";
import Comment from "./comment";

function Slidebar() {
  return (
    <div className="App">
      <nav className="navbar navbar-expand-lg bg-light">
        <div className="container-fluid">
          <Link className="navbar-brand">COFFEE 18 MANAGER</Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link to="/" className="nav-link active" aria-current="page">Trang chủ</Link>
              </li>
              <li className="nav-item">
                <Link to="/comment" className="nav-link">Bình luận</Link>
              </li>
            </ul>
            <div className="d-flex">
              <GoogleAuth />
            </div>
          </div>
        </div>
      </nav>
      <Routes>
      <Route path="/comment" element={<Comment />} />
      </Routes>
    </div>
  );
}

export default Slidebar;
