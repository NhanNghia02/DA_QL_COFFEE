import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc, updateDoc, query, where } from "firebase/firestore";
import 'bootstrap/dist/css/bootstrap.min.css';

function CategoryComponent() {
    const [user, setUser] = useState(null);
    const [categories, setCategories] = useState([]);
    const [editCategory, setEditCategory] = useState(null);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [newCategoryImage, setNewCategoryImage] = useState("");
    const [errors, setErrors] = useState({ categoryName: "" });

    const auth = getAuth();
    const db = getFirestore();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
                fetchCategories(user.uid);
            } else {
                setUser(null);
                setCategories([]);
            }
        });

        return () => unsubscribe();
    }, []);

    const fetchCategories = async (userId) => {
        try {
            const q = query(collection(db, "categories"), where("userId", "==", userId));
            const querySnapshot = await getDocs(q);
            const categoryList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setCategories(categoryList);
        } catch (err) {
            console.error("Error fetching categories: ", err);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(db, "categories", id));
            setCategories(categories.filter(category => category.id !== id));
        } catch (err) {
            console.error("Error deleting category: ", err);
        }
    };

    const handleEdit = (category) => {
        setEditCategory(category);
        setNewCategoryName(category.name);
        setNewCategoryImage(category.image);
    };

    const validateForm = () => {
        let valid = true;
        const newErrors = { categoryName: "" };

        if (!newCategoryName.trim()) {
            newErrors.categoryName = "Category name is required.";
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleSave = async () => {
        if (!validateForm()) return;

        try {
            await updateDoc(doc(db, "categories", editCategory.id), {
                name: newCategoryName,
                image: newCategoryImage
            });
            setCategories(categories.map(category =>
                category.id === editCategory.id
                    ? { ...category, name: newCategoryName, image: newCategoryImage }
                    : category
            ));
            setEditCategory(null);
            setNewCategoryName("");
            setNewCategoryImage("");
            setErrors({ categoryName: "" });
        } catch (err) {
            console.error("Error updating category: ", err);
        }
    };

    const handleAddCategory = async () => {
        if (!validateForm()) return;

        try {
            const userId = user.uid;
            const docRef = await addDoc(collection(db, "categories"), {
                name: newCategoryName,
                image: newCategoryImage || "https://via.placeholder.com/50", // Use placeholder if no image provided
                userId: userId
            });
            const newCategory = {
                id: docRef.id,
                name: newCategoryName,
                image: newCategoryImage || "https://via.placeholder.com/50"
            };
            setCategories([...categories, newCategory]);
            setNewCategoryName("");
            setNewCategoryImage("");
            setErrors({ categoryName: "" });
        } catch (err) {
            console.error("Error adding category: ", err);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewCategoryImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="container">
            <h2 className="my-4">Category Management</h2>

            <div className="mb-4">
                <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Enter category name"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                />
                {errors.categoryName && <div className="text-danger">{errors.categoryName}</div>}
                <input
                    type="file"
                    className="form-control mb-2"
                    onChange={handleImageChange}
                />
                <button className="btn btn-primary" onClick={editCategory ? handleSave : handleAddCategory}>
                    {editCategory ? "Save Changes" : "Add Category"}
                </button>
            </div>

            <ul className="list-group">
                {categories.map((category) => (
                    <li key={category.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                            <div>Name: {category.name}</div>
                            {category.image && <img src={category.image} alt={category.name} style={{ width: "50px" }} />}
                        </div>
                        <div>
                            {editCategory && editCategory.id === category.id ? (
                                <button className="btn btn-success btn-sm mr-2" onClick={handleSave}>Save</button>
                            ) : (
                                <button className="btn btn-primary btn-sm mr-2" onClick={() => handleEdit(category)}>Edit</button>
                            )}
                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(category.id)}>Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default CategoryComponent;
