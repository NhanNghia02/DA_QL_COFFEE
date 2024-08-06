import React, { useState, useEffect } from "react";
<<<<<<< HEAD
import { getFirestore, collection, getDocs, addDoc, deleteDoc, updateDoc, doc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const db = getFirestore();
const storage = getStorage();
=======
import { db, storage } from "../Firebase-config";
import { collection, getDocs, addDoc, deleteDoc, updateDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
>>>>>>> 221482c62281b77cf89a22d38d05098370484979

function MenusComponent() {
    const [drinks, setDrinks] = useState([]);
    const [editingDrink, setEditingDrink] = useState(null);
<<<<<<< HEAD
    const [newName, setNewName] = useState("");
    const [newPrice, setNewPrice] = useState("");
    const [newDiscountCode, setNewDiscountCode] = useState("");
    const [newImage, setNewImage] = useState("");
    const [imagePreview, setImagePreview] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true); 
=======
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
>>>>>>> 221482c62281b77cf89a22d38d05098370484979

    useEffect(() => {
        fetchDrinks();
    }, []);

    const fetchDrinks = async () => {
        setLoading(true);
        try {
            const querySnapshot = await getDocs(collection(db, "drinks"));
            const drinkList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setDrinks(drinkList);
        } catch (err) {
<<<<<<< HEAD
            console.error("Error: ", err);
=======
            console.error("Lỗi: ", err);
>>>>>>> 221482c62281b77cf89a22d38d05098370484979
        } finally {
            setLoading(false);
        }
    };

    const handleAddDrink = async () => {
<<<<<<< HEAD
=======
        setErrorMessages({ name: "", price: "" });

        if (!newName) {
            setErrorMessages(prev => ({ ...prev, name: "Tên không được để trống" }));
        }
        if (!newPrice) {
            setErrorMessages(prev => ({ ...prev, price: "Giá không được để trống và phải là số" }));
        }
        if (!newName || !newPrice) return;
        
>>>>>>> 221482c62281b77cf89a22d38d05098370484979
        const productId = Math.random().toString(36).substring(2, 10).toUpperCase();
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
<<<<<<< HEAD
            await fetchDrinks();
            resetForm();
            setShowForm(false);
        } catch (err) {
            console.error("Error: ", err);
        }
    };

    const handleEdit = (drink) => {
        setEditingDrink(drink);
        setNewName(drink.name);
        setNewPrice(drink.price);
        setNewDiscountCode(drink.discountCode || "");
        setImagePreview(drink.image || "");
        setShowForm(true);
    };

    const handleSave = async () => {
        if (!editingDrink) return;

        let imageUrl = imagePreview;
=======
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
>>>>>>> 221482c62281b77cf89a22d38d05098370484979

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
<<<<<<< HEAD
            await fetchDrinks();
            resetForm();
        } catch (err) {
            console.error("Error: ", err);
=======
            fetchDrinks();
            resetForm();
            setShowForm(false);
        } catch (err) {
            console.error("Lỗi: ", err);
>>>>>>> 221482c62281b77cf89a22d38d05098370484979
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(db, "drinks", id));
            await fetchDrinks();
        } catch (err) {
<<<<<<< HEAD
            console.error("Error: ", err);
        }
    };

=======
            console.error("Lỗi: ", err);
        }
    };

    const handleEdit = (drink) => {
        setEditingDrink(drink);
        setName(drink.name);
        setPrice(drink.price);
        setDiscountCode(drink.discountCode || "");
        setImagePreview(drink.image || "");
        setShowForm(true);
    };

>>>>>>> 221482c62281b77cf89a22d38d05098370484979
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
<<<<<<< HEAD
                setNewImage(file);
=======
                setImage(file);
>>>>>>> 221482c62281b77cf89a22d38d05098370484979
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const resetForm = () => {
        setEditingDrink(null);
<<<<<<< HEAD
        setNewName("");
        setNewPrice("");
        setNewDiscountCode("");
        setNewImage("");
        setImagePreview("");
=======
        setName("");
        setPrice("");
        setDiscountCode("");
        setImage(null);
        setImagePreview("");
        setErrorMessages({ name: "", price: "" });
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
>>>>>>> 221482c62281b77cf89a22d38d05098370484979
    };

    return (
        <div className="container">
            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                <h1 className="h3 mb-0 text-gray-800">Danh Sách Thức Uống</h1>
<<<<<<< HEAD
                <button className="btn btn-success" onClick={() => setShowForm(true)}>
=======
                <button className="btn btn-success" onClick={() => {
                    resetForm();
                    setShowForm(true);
                }}>
>>>>>>> 221482c62281b77cf89a22d38d05098370484979
                    Thêm Thức Uống
                </button>
            </div>
            {loading ? (
<<<<<<< HEAD
                <p>Chưa có thực đơn</p>
=======
                <p>Đang tải...</p>
>>>>>>> 221482c62281b77cf89a22d38d05098370484979
            ) : (
                <div className="mt-2">
                    {showForm && (
                        <div className="mb-4">
                            <label className="label-control">Tên Thực Đơn:</label>
                            <input
                                className="form-control"
                                type="text"
<<<<<<< HEAD
                                id="tableNumber"
                                value={newName}
                                placeholder="Nhập số bàn..."
                                onChange={(e) => setNewName(e.target.value)}
                            />
=======
                                value={newName}
                                placeholder="Nhập tên thực đơn..."
onChange={(e) => setName(e.target.value)}
                            />
                            {errorMessages.name && <div className="text-danger">{errorMessages.name}</div>}

>>>>>>> 221482c62281b77cf89a22d38d05098370484979
                            <label className="label-control">Giá Thực Đơn:</label>
                            <input
                                type="number"
                                className="form-control mb-2"
                                placeholder="Nhập giá thực đơn..."
                                value={newPrice}
<<<<<<< HEAD
                                onChange={(e) => setNewPrice(e.target.value)}
                            />
=======
                                onChange={(e) => setPrice(e.target.value)}
                            />
                            {errorMessages.price && <div className="text-danger">{errorMessages.price}</div>}

>>>>>>> 221482c62281b77cf89a22d38d05098370484979
                            <label className="label-control">Ảnh Thực Đơn:</label>
                            <input
                                type="file"
                                className="form-control-file mb-2"
                                onChange={handleImageChange}
                            />
                            {imagePreview && <img src={imagePreview} alt="Preview" className="img-thumbnail mb-2" style={{ width: 100, height: 100 }} />}
<<<<<<< HEAD
=======

>>>>>>> 221482c62281b77cf89a22d38d05098370484979
                            <br /><label className="label-control">Mã Giảm Giá (Nếu có):</label>
                            <input
                                type="text"
                                className="form-control mb-2"
                                placeholder="Nhập mã giảm giá nếu có..."
                                value={newDiscountCode}
<<<<<<< HEAD
                                onChange={(e) => setNewDiscountCode(e.target.value)}
                            />
                            <button className="btn btn-primary mr-2 mt-3" onClick={editingDrink ? handleSave : handleAddDrink}>
                                {editingDrink ? "Lưu" : "Thêm"}
                            </button>
                            <button className="btn btn-secondary mt-3" onClick={() => { resetForm(); setShowForm(false); }}>
=======
                                onChange={(e) => setDiscountCode(e.target.value)}
                            />
                            <button className="btn btn-success mr-2 mt-3" onClick={editingDrink ? handleSave : handleAddDrink}>
                                {editingDrink ? "Lưu" : "Thêm"}
                            </button>
                            <button className="btn btn-secondary mt-3" onClick={() => {
                                resetForm();
                                setShowForm(false);
                            }}>
>>>>>>> 221482c62281b77cf89a22d38d05098370484979
                                Hủy
                            </button>
                        </div>
                    )}

<<<<<<< HEAD

=======
>>>>>>> 221482c62281b77cf89a22d38d05098370484979
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
<<<<<<< HEAD
                                    <td>{drink.productId}</td>
                                    <td>{drink.name}</td>
                                    <td>{drink.price.toFixed(3)} VNĐ</td>
                                    <td>{drink.discountCode || "N/A"}</td>
                                    <td>{drink.image && <img src={drink.image} alt={drink.name} className="img-thumbnail" style={{ width: 40, height: 40 }} />}</td>
                                    <td><button className="btn btn-primary btn-sm mr-2" onClick={() => handleEdit(drink)}>Sửa</button></td>
                                    <td><button className="btn btn-danger btn-sm" onClick={() => handleDelete(drink.id)}>Xóa</button></td>
=======
<td>{drink.productId}</td>
                                    <td>{drink.name}</td>
                                    <td>{formatPrice(drink.price)}</td>
                                    <td>{drink.discountCode || "Không có mã giảm giá"}</td>
                                    <td>{drink.image && <img src={drink.image} alt={drink.name} className="img-thumbnail" style={{ width: 40, height: 40 }} />}</td>
                                    <td><button className="btn btn-warning btn-sm mr-2 " onClick={() => handleEdit(drink)}><i className="fa fa-edit"></i> Sửa</button></td>
                                    <td><button className="btn btn-danger btn-sm" onClick={() => handleDelete(drink.id)}><i className="fa fa-close"></i> Xóa</button></td>
>>>>>>> 221482c62281b77cf89a22d38d05098370484979
                                </tr>
                            ))}
                        </tbody>
                    </table>
<<<<<<< HEAD

=======
>>>>>>> 221482c62281b77cf89a22d38d05098370484979
                </div>
            )}
        </div>
    );
}

<<<<<<< HEAD
export default MenusComponent;
=======
export default MenusComponent;
>>>>>>> 221482c62281b77cf89a22d38d05098370484979
