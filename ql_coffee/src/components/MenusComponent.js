import React, { useState, useEffect, useCallback } from "react";
import { db, storage } from "../model/Firebase-config";
import { collection, getDocs, addDoc, deleteDoc, updateDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import ConfinModal from "../model/ConfinModel";

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
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("Tất cả");

    const fetchCategories = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "categories"));
            const categoriesList = querySnapshot.docs.map(doc => doc.data().name);
            if (!categoriesList.includes("Coffee")) {
                categoriesList.push("Coffee");
            }
            setCategories(["Tất cả", ...categoriesList]);
        } catch (err) {
            console.error("Lỗi: ", err);
        }
    };

    const fetchDrinks = useCallback(async () => {
        setLoading(true);
        try {
            const querySnapshot = await getDocs(collection(db, "drinks"));
            const drinkList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            drinkList.sort((a, b) => a.productId - b.productId);
            if (selectedCategory !== "Tất cả") {
                const filteredDrinks = drinkList.filter(drink => drink.category === selectedCategory);
                setDrinks(filteredDrinks);
            } else {
                setDrinks(drinkList);
            }
        } catch (err) {
            console.error("Lỗi: ", err);
        } finally {
            setLoading(false);
        }
    }, [selectedCategory]);

    const fetchMaxProductId = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "drinks"));
            const drinksArray = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            const maxProductId = drinksArray.reduce((maxId, drink) => Math.max(maxId, drink.productId), 0);
            return maxProductId;
        } catch (err) {
            console.error("Error: ", err);
            return 0;
        }
    };

    useEffect(() => {
        fetchCategories();
        fetchDrinks();
    }, [fetchDrinks]);

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
                image: imageUrl || null,
                category: selectedCategory
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
                image: imageUrl || null,
                category: selectedCategory
            });
            fetchDrinks();
            resetForm();
            setShowForm(false);
        } catch (err) {
            console.error("Lỗi: ", err);
        }
    };

    const updateId = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "drinks"));
            const drinksArray = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            drinksArray.sort((a, b) => a.productId - b.productId);
            for (let i = 0; i < drinksArray.length; i++) {
                const drink = drinksArray[i];
                const newProductId = i + 1;
                if (drink.productId !== newProductId) {
                    await updateDoc(doc(db, "drinks", drink.id), { productId: newProductId });
                }
            }
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
                await updateId();
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
        setSelectedCategory(drink.category || "Tất cả");
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
        setSelectedCategory("Tất cả");
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
                    Thêm Món
                </button>
            </div>
            <div className="mb-4">
                <label className="label-control">Danh Mục</label>
                <select
                    className="form-control"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                >
                    {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                    ))}
                </select>
            </div>
            {loading ? (
                <p>Đang tải...</p>
            ) : (
                <div className="mt-2">
                    {showForm && (
                        <div className="card mb-4">
                            <div className="card-body">
                                <form>
                                    <div className="mb-3">
                                        <label className="form-label">Tên Món</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={newName}
                                            placeholder="Nhập tên món..."
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                        {errorMessages.name && <div className="text-danger">{errorMessages.name}</div>}
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Giá</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={newPrice}
                                            placeholder="Nhập giá món..."
                                            onChange={(e) => setPrice(e.target.value)}
                                        />
                                        {errorMessages.price && <div className="text-danger">{errorMessages.price}</div>}
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Mã Giảm Giá</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={newDiscountCode}
                                            placeholder="Nhập mã giảm giá món (nếu có)..."
                                            onChange={(e) => setDiscountCode(e.target.value)}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Hình Ảnh</label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            onChange={handleImageChange}
                                        />
                                        {imagePreview && (
                                            <img src={imagePreview} alt="Preview" className="img-thumbnail mt-2" />
                                        )}
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Danh Mục</label>
                                        <select
                                            className="form-control"
                                            value={selectedCategory}
                                            onChange={(e) => setSelectedCategory(e.target.value)}
                                        >
                                            {categories.map(category => (
                                                <option key={category} value={category}>{category}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <button type="button" className="btn btn-primary" onClick={editingDrink ? handleSave : handleAddDrink}>
                                        {editingDrink ? "Sửa" : "Thêm"}
                                    </button>
                                    <button type="button" className="btn btn-secondary ms-2" onClick={() => setShowForm(false)}>
                                        Hủy
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Tên Món</th>
                                <th>Giá</th>
                                <th>Danh Mục</th>
                                <th>Hình Ảnh</th>
                                <th>Sửa</th>
                                <th>Xóa</th>
                            </tr>
                        </thead>
                        <tbody>
                            {drinks.map((drink, index) => (
                                <tr key={drink.id}>
                                    <td>{index + 1}</td>
                                    <td>{drink.name}</td>
                                    <td>{formatPrice(drink.price)}</td>
                                    <td>{drink.category}</td>
                                    <td>
                                        {drink.image && <img src={drink.image} alt={drink.name} className="img-thumbnail" style={{ width: '70px' }} />}
                                    </td>
                                    <td>
                                        <button className="btn btn-warning me-2" onClick={() => handleEdit(drink)}>
                                            <i className="fas fa-edit"></i> Sửa
                                        </button>
                                    </td>
                                    <td>
                                        <button className="btn btn-danger" onClick={() => handleDelete(drink)}>
                                            <i className="fas fa-trash"></i> Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {showConfirm && (
                <ConfinModal
                    title="Xác Nhận Xóa"
                    message={`Bạn có chắc chắn muốn xóa món ${drinkToDelete?.name}?`}
                    onConfirm={confirmDelete}
                    onCancel={() => setShowConfirm(false)}
                />
            )}
        </div>
    );
}

export default MenusComponent;
