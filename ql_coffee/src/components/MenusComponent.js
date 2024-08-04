import React, { useState, useEffect } from "react";
import { getFirestore, collection, getDocs, addDoc, deleteDoc, updateDoc, doc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const db = getFirestore();
const storage = getStorage();

function MenusComponent() {
    const [drinks, setDrinks] = useState([]);
    const [editingDrink, setEditingDrink] = useState(null);
    const [newName, setNewName] = useState("");
    const [newPrice, setNewPrice] = useState("");
    const [newDiscountCode, setNewDiscountCode] = useState("");
    const [newImage, setNewImage] = useState("");
    const [imagePreview, setImagePreview] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true); 

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
            console.error("Error: ", err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddDrink = async () => {
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
            await fetchDrinks();
            resetForm();
        } catch (err) {
            console.error("Error: ", err);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(db, "drinks", id));
            await fetchDrinks();
        } catch (err) {
            console.error("Error: ", err);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewImage(file);
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const resetForm = () => {
        setEditingDrink(null);
        setNewName("");
        setNewPrice("");
        setNewDiscountCode("");
        setNewImage("");
        setImagePreview("");
    };

    return (
        <div className="container">
            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                <h1 className="h3 mb-0 text-gray-800">Danh Sách Thức Uống</h1>
                <button className="btn btn-success" onClick={() => setShowForm(true)}>
                    Thêm Thức Uống
                </button>
            </div>
            {loading ? (
                <p>Chưa có thực đơn</p>
            ) : (
                <div className="mt-2">
                    {showForm && (
                        <div className="mb-4">
                            <label className="label-control">Tên Thực Đơn:</label>
                            <input
                                className="form-control"
                                type="text"
                                id="tableNumber"
                                value={newName}
                                placeholder="Nhập số bàn..."
                                onChange={(e) => setNewName(e.target.value)}
                            />
                            <label className="label-control">Giá Thực Đơn:</label>
                            <input
                                type="number"
                                className="form-control mb-2"
                                placeholder="Nhập giá thực đơn..."
                                value={newPrice}
                                onChange={(e) => setNewPrice(e.target.value)}
                            />
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
                                onChange={(e) => setNewDiscountCode(e.target.value)}
                            />
                            <button className="btn btn-primary mr-2 mt-3" onClick={editingDrink ? handleSave : handleAddDrink}>
                                {editingDrink ? "Lưu" : "Thêm"}
                            </button>
                            <button className="btn btn-secondary mt-3" onClick={() => { resetForm(); setShowForm(false); }}>
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
                                    <td>{drink.price.toFixed(3)} VNĐ</td>
                                    <td>{drink.discountCode || "N/A"}</td>
                                    <td>{drink.image && <img src={drink.image} alt={drink.name} className="img-thumbnail" style={{ width: 40, height: 40 }} />}</td>
                                    <td><button className="btn btn-primary btn-sm mr-2" onClick={() => handleEdit(drink)}>Sửa</button></td>
                                    <td><button className="btn btn-danger btn-sm" onClick={() => handleDelete(drink.id)}>Xóa</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                </div>
            )}
        </div>
    );
}

export default MenusComponent;
