import React, { useState, useEffect } from 'react';
import { db } from '../model/Firebase-config';
import { collection, query, where, getDocs, addDoc, updateDoc } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import '../layouts/css/OrderTable.css';

function OrderTableComponent() {
    const [table, setTable] = useState(null);
    const [drinks, setDrinks] = useState([]);
    const [filteredDrinks, setFilteredDrinks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [order, setOrder] = useState({});
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [drinksPerPage] = useState(3);
    const { tableId } = useParams();

    const indexOfLastDrink = currentPage * drinksPerPage;
    const indexOfFirstDrink = indexOfLastDrink - drinksPerPage;
    const currentDrinks = filteredDrinks.slice(indexOfFirstDrink, indexOfLastDrink);
    const totalPages = Math.ceil(filteredDrinks.length / drinksPerPage);

    useEffect(() => {
        const fetchTable = async () => {
            try {
                setLoading(true);
                const tablesCollectionRef = collection(db, 'tables');
                const q = query(tablesCollectionRef, where("number", "==", tableId));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    const tableDoc = querySnapshot.docs[0];
                    setTable({ ...tableDoc.data(), id: tableDoc.id });
                } else {
                    setError("Bàn không tồn tại");
                }
            } catch (error) {
                console.error("Lỗi: ", error);
            } finally {
                setLoading(false);
            }
        };

        const fetchDrinks = async () => {
            try {
                const drinksCollectionRef = collection(db, 'drinks');
                const q = query(drinksCollectionRef);
                const querySnapshot = await getDocs(q);
                const drinksArray = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
                setDrinks(drinksArray);
                setFilteredDrinks(drinksArray);
            } catch (error) {
                console.error("Lỗi: ", error);
            }
        };

        fetchTable();
        fetchDrinks();
    }, [tableId]);

    useEffect(() => {
        const results = searchTerm
            ? drinks.filter(drink =>
                drink.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            : drinks;

        setFilteredDrinks(results);
        setCurrentPage(1);
    }, [searchTerm, drinks]);

    const handleCheckboxChange = (id) => {
        setOrder(prevOrder => {
            const newOrder = { ...prevOrder };
            if (newOrder[id]) {
                delete newOrder[id];
            } else {
                newOrder[id] = { quantity: 1 };
            }
            return newOrder;
        });
    };

    const handleQuantityChange = (id, value) => {
        setOrder(prevOrder => ({
            ...prevOrder,
            [id]: {
                ...prevOrder[id],
                quantity: value
            }
        }));
    };

    const incrementQuantity = (id) => {
        setOrder(prevOrder => ({
            ...prevOrder,
            [id]: {
                ...prevOrder[id],
                quantity: (prevOrder[id]?.quantity || 1) + 1
            }
        }));
    };

    const decrementQuantity = (id) => {
        setOrder(prevOrder => ({
            ...prevOrder,
            [id]: {
                ...prevOrder[id],
                quantity: Math.max((prevOrder[id]?.quantity || 1) - 1, 1)
            }
        }));
    };

    const handleOrderSubmit = async () => {
        try {
            if (!table) {
                throw new Error("Bàn không tồn tại");
            }

            const ordersCollectionRef = collection(db, 'orders');
            const existingOrderQuery = query(
                ordersCollectionRef,
                where("tableId", "==", table.id),
                where("createdAt", ">=", new Date(new Date().setHours(0, 0, 0, 0)))
            );
            const existingOrderSnapshot = await getDocs(existingOrderQuery);
            let existingOrder = {};
            if (!existingOrderSnapshot.empty) {
                const existingOrderDoc = existingOrderSnapshot.docs[0];
                existingOrder = existingOrderDoc.data();
            }

            const newItems = Object.keys(order).map(drinkId => ({
                id: drinkId,
                name: drinks.find(d => d.id === drinkId)?.name || '',
                quantity: order[drinkId].quantity,
                price: drinks.find(d => d.id === drinkId)?.price || 0
            }));

            const mergedItems = (existingOrder.items || []).reduce((acc, item) => {
                const existingItem = acc.find(i => i.id === item.id);
                if (existingItem) {
                    existingItem.quantity += item.quantity;
                } else {
                    acc.push(item);
                }
                return acc;
            }, newItems);

            const orderData = {
                tableId: table.id,
                items: mergedItems,
                createdAt: new Date()
            };

            if (existingOrderSnapshot.empty) {
                await addDoc(ordersCollectionRef, orderData);
            } else {
                const orderDocRef = existingOrderSnapshot.docs[0].ref;
                await updateDoc(orderDocRef, { items: mergedItems, createdAt: new Date() });
            }

            setOrder({});
        } catch (error) {
            console.error("Lỗi: ", error);
        }
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    const calculateTotal = () => {
        return Object.keys(order).reduce((total, drinkId) => total + (order[drinkId].quantity * (drinks.find(d => d.id === drinkId)?.price || 0)), 0);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    if (loading) {
        return <p>Đang tải...</p>;
    }

    return (
        <div className="container">
            <h3 className="h3 mb-0 text-gray-800">Chọn Món Bàn Số {table ? table.number : ''}</h3>
            {error ? (
                <p className="text-danger">{error}</p>
            ) : (
                <div>
                    <div className="mb-4 mt-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Tìm kiếm món uống..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="menu mt-2">
                        {currentDrinks.length > 0 ? (
                            <div className="row">
                                {currentDrinks.map(drink => (
                                    <div key={drink.id} className="col-md-12 mb-4">
                                        <div className="menu-item d-flex align-items-center p-3 border rounded">
                                            <input
                                                type="checkbox"
                                                checked={!!order[drink.id]}
                                                onChange={() => handleCheckboxChange(drink.id)}
                                                className="mr-2"
                                            />
                                            <div className="menu-item-details flex-grow-1">
                                                <p className="menu-item-name mb-0">{drink.name}</p>
                                            </div>
                                            <div className="menu-item-details flex-grow-1">
                                                <img src={drink.image} alt={drink.name} width={30} />
                                            </div>
                                            <div className="menu-item-details flex-grow-1">
                                                <p className="menu-item-price mb-0">{formatCurrency(drink.price)}</p>
                                            </div>
                                            <div className="menu-item-quantity d-flex align-items-center ml-auto">
                                                <button
                                                    className="btn btn-outline-secondary"
                                                    onClick={() => decrementQuantity(drink.id)}
                                                >
                                                    -
                                                </button>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    className="form-control mx-2"
                                                    value={order[drink.id]?.quantity || 1}
                                                    onChange={(e) => handleQuantityChange(drink.id, parseInt(e.target.value, 10) || 1)}
                                                />
                                                <button
                                                    className="btn btn-outline-secondary"
                                                    onClick={() => incrementQuantity(drink.id)}
                                                >
                                                    +
                                                </button>
                                                <p className="menu-item-total ml-3 mb-0">
                                                    <strong>Thành tiền:</strong> {formatCurrency((order[drink.id]?.quantity || 1) * drink.price)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>Danh sách món uống trống</p>
                        )}
                    </div>

                    <div className="d-flex justify-content-center">
                        {Array.from({ length: totalPages }, (_, index) => (
                            <button
                                key={index}
                                className={`btn btn-outline-primary mx-1 ${index + 1 === currentPage ? 'active' : ''}`}
                                onClick={() => handlePageChange(index + 1)}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>

                    <div className="sticky-footer mt-2">
                        {Object.keys(order).length > 0 && (
                            <div className="order-summary p-3 border rounded">
                                <div className="d-flex justify-content-between align-items-center">
                                    <strong>Tổng cộng:</strong>
                                    <strong>{formatCurrency(calculateTotal())}</strong>
                                </div>
                            </div>
                        )}
                        <button className="btn btn-success mt-4" onClick={handleOrderSubmit}>
                            Báo Chế Biến
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default OrderTableComponent;
