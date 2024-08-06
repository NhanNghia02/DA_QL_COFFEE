<<<<<<< HEAD
import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, getDocs, query, where } from "firebase/firestore";

const auth = getAuth();
const db = getFirestore();

function OrderComponent() {
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
                fetchOrders(user.uid);
            } else {
                setUser(null);
                setOrders([]);
            }
        });

        return () => unsubscribe();
    }, []);

    const fetchOrders = async (userId) => {
        try {
            const q = query(collection(db, "orders"), where("userId", "==", userId));
            const querySnapshot = await getDocs(q);
            const orderList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setOrders(orderList);
        } catch (err) {
            console.error("Error fetching orders: ", err);
        }
    };

    const calculateTotalAmount = (order) => {
        return order.products.reduce((total, product) => total + (product.price * product.quantity), 0);
=======
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
>>>>>>> 221482c62281b77cf89a22d38d05098370484979
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

            <div className="list-group">
                {orders.map((order) => (
                    <div key={order.id} className="list-group-item">
                        <h5 className="mb-3">Số Bàn: {order.tableNumber}</h5>
                        <h6 className="mb-3">Người Đặt: {user.displayName || "Unknown"}</h6>
                        <ul>
                            {order.products.map((product, index) => (
                                <li key={index}>
                                    {product.name} - {product.quantity} x ${product.price}
                                </li>
                            ))}
                        </ul>
                        <h5 className="mt-3">Tổng Thành Tiền: ${calculateTotalAmount(order)}</h5>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default OrderComponent;
