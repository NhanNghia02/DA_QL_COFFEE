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
    };

    return (
        <div className="container">
            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                <h1 className="h3 mb-0 text-gray-800">Đơn Hàng</h1>
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
