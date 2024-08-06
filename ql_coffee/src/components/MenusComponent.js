import React, { useState, useEffect } from "react";
import { db, storage } from "../Firebase-config";
import { collection, getDocs, addDoc, deleteDoc, updateDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import ConfinModal from "../ConfinModel";

function MenusComponent() {
    const [drinks, setDrinks] = useState([]);
    const [editingDrink, setEditingDrink] = useState(null);
    const [newName, setName] = useState("");
    const [newPrice, setPrice] = useState("");
    const [newDiscountCode, setDiscountCode] = useState("");
    const [newImage, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [errorMessages, setErrorMessages] = useState({
        name: "",
        price: "",
    });
    const [showConfirm, setShowConfirm] = useState(false);
    const [drinkToDelete, setDrinkToDelete] = useState(null);

    useEffect(() => {
        fetchDrinks();
    }, []);

    const fetchDrinks = async () => {
        setLoading(true);
        try {
            const querySnapshot = await getDocs(collection(db, "drinks"));
            const drinkList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            drinkList.sort((a, b) => a.productId - b.productId);
            setDrinks(drinkList);
        } catch (err) {
            console.error("Lỗi: ", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchMaxProductId = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "drinks"));
            const drinksArray = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            const maxProductId = drinksArray.reduce((maxId, drink) => Math.max(maxId, drink.productId), 0);
            return maxProductId;
        } catch (err) {
            console.error("Error fetching max product ID: ", err);
            return 0;
        }
    };

    const handleAddDrink = async () => {
        setErrorMessages({ name: "", price: "" });

        if (!newName) {
            setErrorMessages(prev => ({ ...prev, name: "Tên không được để trống" }));
        }
        if (!newPrice) {
            setErrorMessages(prev => ({ ...prev, price: "Giá không được để trống và phải là số" }));
        }
        if (!newName || !newPrice) return;
        
        const maxProductId = await fetchMaxProductId();
        const productId = maxProductId + 1;
        let imageUrl = null;

        if (newImage) {
            const imageRef = ref(storage, `drinks/${productId}`);
            const uploadResult = await uploadBytes(imageRef, newImage);
            imageUrl = await getDownloadURL(uploadResult.ref);
        }

        try {
            await addDoc(collection(db, "drinks"), {
                productId,
                name: newName,
                price: parseFloat(newPrice),
                discountCode: newDiscountCode || null,
                image: imageUrl || null
            });
            fetchDrinks();
            resetForm();
            setShowForm(false);
        } catch (err) {
            console.error("Lỗi: ", err);
        }
    };

    const handleSave = async () => {
        setErrorMessages({ name: "", price: "" });

        if (!newName) {
            setErrorMessages(prev => ({ ...prev, name: "Tên không được để trống" }));
        }
        if (!newPrice) {
            setErrorMessages(prev => ({ ...prev, price: "Giá không được để trống và phải là số" }));
        }

        if (!newName || !newPrice) return;

        let imageUrl = imagePreview;

        if (newImage) {
            const imageRef = ref(storage, `drinks/${editingDrink.productId}`);
            const uploadResult = await uploadBytes(imageRef, newImage);
            imageUrl = await getDownloadURL(uploadResult.ref);
        }

        try {
            await updateDoc(doc(db, "drinks", editingDrink.id), {
                name: newName,
                price: parseFloat(newPrice),
                discountCode: newDiscountCode || null,
                image: imageUrl || null
            });
            fetchDrinks();
            resetForm();
            setShowForm(false);
        } catch (err) {
            console.error("Lỗi: ", err);
        }
    };

    const handleDelete = (drink) => {
        setDrinkToDelete(drink);
        setShowConfirm(true);
    };

    const confirmDelete = async () => {
        if (drinkToDelete) {
            try {
                await deleteDoc(doc(db, "drinks", drinkToDelete.id));
                await fetchDrinks();
            } catch (err) {
                console.error("Lỗi: ", err);
            }
        }
        setShowConfirm(false);
        setDrinkToDelete(null);
    };

    const handleEdit = (drink) => {
        setEditingDrink(drink);
        setName(drink.name);
        setPrice(drink.price);
        setDiscountCode(drink.discountCode || "");
        setImagePreview(drink.image || "");
        setShowForm(true);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(file);
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const resetForm = () => {
        setEditingDrink(null);
        setName("");
        setPrice("");
        setDiscountCode("");
        setImage(null);
        setImagePreview("");
        setErrorMessages({ name: "", price: "" });
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    return (
        <div className="container">
            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                <h1 className="h3 mb-0 text-gray-800">Danh Sách Thức Uống</h1>
                <button className="btn btn-success" onClick={() => {
                    resetForm();
                    setShowForm(true);
                }}>
                    Thêm Thức Uống
                </button>
            </div>
            {loading ? (
                <p>Đang tải...</p>
            ) : (
                <div className="mt-2">
                    {showForm && (
                        <div className="mb-4">
                            <label className="label-control">Tên Thực Đơn:</label>
                            <input
                                className="form-control"
                                type="text"
                                value={newName}
                                placeholder="Nhập tên thực đơn..."
                                onChange={(e) => setName(e.target.value)}
                            />
                            {errorMessages.name && <div className="text-danger">{errorMessages.name}</div>}

                            <label className="label-control">Giá Thực Đơn:</label>
                            <input
                                type="number"
                                className="form-control mb-2"
                                placeholder="Nhập giá thực đơn..."
                                value={newPrice}
                                onChange={(e) => setPrice(e.target.value)}
                            />
                            {errorMessages.price && <div className="text-danger">{errorMessages.price}</div>}

                            <label className="label-control">Ảnh Thực Đơn:</label>
                            <input
                                type="file"
                                className="form-control-file mb-2"
                                onChange={handleImageChange}
                            />
                            {imagePreview && <img src={imagePreview} alt="Preview" className="img-thumbnail mb-2" style={{ width: 100, height: 100 }} />}

                            <br /><label className="label-control">Mã Giảm Giá (Nếu có):</label>
                            <input
                                type="text"
                                className="form-control mb-2"
                                placeholder="Nhập mã giảm giá nếu có..."
                                value={newDiscountCode}
                                onChange={(e) => setDiscountCode(e.target.value)}
                            />
                            <button className="btn btn-success mr-2 mt-3" onClick={editingDrink ? handleSave : handleAddDrink}>
                                {editingDrink ? "Lưu" : "Thêm"}
                            </button>
                            <button className="btn btn-secondary mt-3" onClick={() => {
                                resetForm();
                                setShowForm(false);
                            }}>
                                Hủy
                            </button>
                        </div>
                    )}

                    <table className="table">
                        <thead>
                            <tr>
                                <th>Mã</th>
                                <th>Tên</th>
                                <th>Giá</th>
                                <th>Mã Giảm Giá</th>
                                <th>Ảnh</th>
                                <th>Sửa</th>
                                <th>Xóa</th>
                            </tr>
                        </thead>
                        <tbody>
                            {drinks.map((drink) => (
                                <tr key={drink.id}>
                                    <td>{drink.productId}</td>
                                    <td>{drink.name}</td>
                                    <td>{formatPrice(drink.price)}</td>
                                    <td>{drink.discountCode || "Không có mã giảm giá"}</td>
                                    <td>{drink.image && <img src={drink.image} alt={drink.name} className="img-thumbnail" style={{ width: 40, height: 40 }} />}</td>
                                    <td><button className="btn btn-warning btn-sm mr-2 " onClick={() => handleEdit(drink)}><i className="fa fa-edit"></i> Sửa</button></td>
                                    <td><button className="btn btn-danger btn-sm" onClick={() => handleDelete(drink)}><i className="fa fa-close"></i> Xóa</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            <ConfinModal 
                show={showConfirm} 
                onConfirm={confirmDelete} 
                onCancel={() => setShowConfirm(false)} 
                message="Bạn có chắc chắn muốn xóa?" 
            />
        </div>
    );
}

export default MenusComponent;
