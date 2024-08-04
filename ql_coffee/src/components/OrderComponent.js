import React from 'react';
import { useLocation } from 'react-router-dom';

function OrderComponent() {
    const location = useLocation();
    const { table } = location.state || {};

    if (!table) {
        return <div>Không có thông tin bàn</div>;
    }

    const calculateTotal = () => {
        return table.items.reduce((total, item) => total + item.price, 0);
    };

    return (
        <div className="container">
            <h1>Hóa Đơn</h1>
            <div className="card mb-3">
                <div className="card-body">
                    <h5 className="card-title">Bàn {table.number}</h5>
                    <p className="card-text">Giá tổng cộng: {calculateTotal()} VND</p>
                    <ul className="list-group list-group-flush">
                        {table.items && table.items.length > 0 && (
                            table.items.map(item => (
                                <li key={item.id} className="list-group-item">
                                    <div className="d-flex align-items-center">
                                        <img src={item.image} alt={item.name} className="img-thumbnail mr-3" style={{ width: 50, height: 50 }} />
                                        <div>
                                            <p className="mb-0">{item.name}</p>
                                            <p className="mb-0 text-muted">{item.price} VND</p>
                                        </div>
                                    </div>
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default OrderComponent;
