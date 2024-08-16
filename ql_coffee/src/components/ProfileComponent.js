import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, updateProfile } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../model/Firebase-config';

function ProfileComponent() {
    const [user, setUser] = useState(null);
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const auth = getAuth();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser({
                    name: currentUser.displayName || "No Name",
                    email: currentUser.email || "No Email",
                    imgURL: currentUser.photoURL || "No Image"
                });
            } else {
                setUser(null);
            }
        });

        return () => unsubscribe();
    }, [auth]);

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleImageUpload = async () => {
        if (image && auth.currentUser) {
            setLoading(true);
            const imageRef = ref(storage, `profile-images/${auth.currentUser.uid}/${image.name}`);
            try {
                await uploadBytes(imageRef, image);
                const downloadURL = await getDownloadURL(imageRef);
                await updateProfile(auth.currentUser, { photoURL: downloadURL });

                setUser((prevUser) => ({ ...prevUser, imgURL: downloadURL }));
                setImage(null);
                setError(null);
            } catch (err) {
                console.error('Lỗi tải hình ảnh:', err);
                setError(`Không thể tải hình ảnh: ${err.message}`);
            } finally {
                setLoading(false);
            }
        }
    };

    if (!user) {
        return (
            <div className='container'>
                <h4>Bạn chưa có tài khoản hoặc chưa đăng nhập.<br />
                    Bạn vui lòng đăng ký hoặc đăng nhập để nhận thông tin tài khoản.</h4>
                <a className='btn btn-primary mt-3' href='/admin/logins'>Đăng Nhập Ngay</a>
            </div>
        );
    }

    return (
        <div className="container mt-1">
            <div className="card" style={{ maxWidth: '300px', margin: 'auto' }}>
                <img src={user.imgURL} alt="No_Image" className="card-img-top" style={{ height: '300px' }} />
                <div className="card-body">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="form-control"
                    />
                    {error && <p className="text-danger mt-2">{error}</p>}

                    <h5 className="card-title mt-3">{user.name}</h5>
                    <p className="card-text">{user.email}</p>
                    <button
                        className="btn btn-primary mt-2"
                        onClick={handleImageUpload}
                        disabled={loading}
                    >
                        {loading ? 'Đang tải lên...' : 'Tải ảnh lên'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProfileComponent;
