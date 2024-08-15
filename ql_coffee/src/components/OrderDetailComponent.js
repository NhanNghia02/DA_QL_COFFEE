import React, { useEffect, useState } from 'react';
import { getDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../model/Firebase-config';
import { useLocation, useNavigate } from 'react-router-dom';

function OrderComponent() {
    const location = useLocation();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [table, setTable] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isPaid, setIsPaid] = useState(false);

    useEffect(() => {
        const fetchOrder = async () => {
            setLoading(true);
            setError(null);
            const orderId = location.state?.orderId;

            if (!orderId) {
                setError("Không có id đơn hàng");
                setLoading(false);
                return;
            }

            try {
                const orderDocRef = doc(db, 'orders', orderId);
                const orderDoc = await getDoc(orderDocRef);

                if (orderDoc.exists()) {
                    const orderData = orderDoc.data();
                    setOrder(orderData);
                    setIsPaid(orderData.isPaid || false);

                    const tableDocRef = doc(db, 'tables', orderData.tableId);
                    const tableDoc = await getDoc(tableDocRef);

                    if (tableDoc.exists()) {
                        setTable(tableDoc.data());
                    } else {
                        setError("Bàn không tồn tại");
                    }
                } else {
                    setError("Đơn hàng không tồn tại");
                }
            } catch (error) {
                setError(`Lỗi: ${error.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [location.state]);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    const calculateTotal = () => {
        return order?.items?.reduce((total, item) => total + item.price * item.quantity, 0) ?? 0;
    };

    const calculateItemTotal = (price, quantity) => price * quantity;

    const handlePayment = async () => {
        try {
            await updateDoc(doc(db, 'orders', location.state.orderId), { isPaid: true });
            setIsPaid(true);
            console.log("Thanh toán thành công");
        } catch (error) {
            console.error("Lỗi: ", error);
        }
    };

    const handleCancel = () => {
        navigate('/admin/orders');
    };

    const handleRemoveItem = async (itemId) => {
        try {
            const updatedItems = order.items.map(item =>
                item.id === itemId ? { ...item, quantity: Math.max(item.quantity - 1, 0) } : item
            ).filter(item => item.quantity > 0);

            await updateDoc(doc(db, 'orders', location.state.orderId), { items: updatedItems });
            setOrder(prevOrder => ({ ...prevOrder, items: updatedItems }));
        } catch (error) {
            console.error("Lỗi: ", error);
        }
    };

    if (loading) {
        return <div>Đang tải...</div>;
    }

    if (error) {
        return <div>Lỗi: {error}</div>;
    }

    return (
        <div className="container">
            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                <h3 className="h3 mb-0 text-gray-800">Chi Tiết Đơn Hàng</h3>
            </div>
            <div className="card mb-3">
                <div className="card-body">
                {isPaid && <p className="text-success mt-3"><strong>Đã thanh toán</strong></p>}
                    <h6 className="card-title">Bàn {table?.number}</h6>
                    <p>Ngày: {order?.createdAt ? new Date(order.createdAt.seconds * 1000).toLocaleString('vi-VN') : 'Không có ngày'}</p>
                    {order?.items && order.items.length > 0 ? (
                        <ul className="list-group list-group-flush">
                            {order.items.map(item => (
                                <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                                    <div>
                                        <div className="d-flex align-items-center">
                                            <div className="d-flex flex-column text-left">
                                                <p className="mb-1">Tên món: {item.name}</p>
                                            </div>
                                            <div className="d-flex flex-column text-left">
                                                <p className="mb-1 mx-5">{formatCurrency(item.price)}</p>
                                            </div>
                                            <div className="d-flex flex-column text-right">
                                                <p className="mb-1 text-muted mx-5"><strong>x {item.quantity}</strong></p>
                                            </div>
                                            <div className="d-flex flex-column text-right">
                                                <p className="mb-1 text-muted mx-5"><strong>Tổng: {formatCurrency(calculateItemTotal(item.price, item.quantity))}</strong></p>
                                            </div>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleRemoveItem(item.id)}
                                            >
                                                Xóa
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="card-text">Không có món nào trong đơn hàng</p>
                    )}
                    <h5 className="h5 mb-0 text-gray-900 mt-4">Tổng Thanh Toán: {formatCurrency(calculateTotal())}</h5>
                    <div className="mt-4">
                        <button className="btn btn-primary" onClick={handlePayment} disabled={isPaid}>
                            {isPaid ? "Đã Thanh Toán" : "Thanh Toán"}
                            {isPaid && <i className="fa fa-check ml-2 text-success" aria-hidden="true"></i>}
                        </button>
                        <button className="btn btn-secondary ml-2" onClick={handleCancel}>Hủy</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrderComponent;
