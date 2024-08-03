import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import '../layouts/css/Order.css';

function OrderComponent() {
    const location = useLocation();
    const { table } = location.state || {};
    const navigate = useNavigate();

    if (!table) {
        navigate('/tables');
        return null;
    }

    const totalAmount = table.items.reduce((total, item) => total + item.price, 0);

    return (
        <div className="container">
            <h2 className="my-4 text-center">Hóa Đơn Thanh Toán</h2>
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">Bàn {table.number}</h5>
                    <ul className="list-group list-group-flush">
                        {table.items.length > 0 ? (
                            table.items.map(item => (
                                <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                                    <div className="d-flex align-items-center">
                                        <img src={item.image} alt={item.name} className="img-thumbnail mr-3" />
                                        <div>
                                            <p className="mb-0">{item.name}</p>
                                            <p className="mb-0 text-muted">{item.price} VND</p>
                                        </div>
                                    </div>
                                    <span>{item.price} VND</span>
                                </li>
                            ))
                        ) : (
                            <li className="list-group-item">Không có món nào trong hóa đơn</li>
                        )}
                    </ul>
                    <div className="d-flex justify-content-between align-items-center mt-4">
                        <h5>Tổng tiền:</h5>
                        <h5>{totalAmount} VND</h5>
                    </div>
                    <div className="text-center mt-4">
                        <button className="btn btn-primary" onClick={() => navigate('/tables')}>Quay lại</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrderComponent;
