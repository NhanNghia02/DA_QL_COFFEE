import React, { useEffect, useState } from "react";

function AccountComponents() {
    const [accounts, setAccounts] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const response = await fetch('YOUR_CLOUD_FUNCTION_URL');
                if (!response.ok) {
                    throw new Error('Có lỗi xảy ra khi lấy danh sách tài khoản.');
                }
                const accountsList = await response.json();
                setAccounts(accountsList);
            } catch (err) {
                console.error("Lỗi khi lấy danh sách tài khoản:", err);
                setError("Có lỗi xảy ra khi lấy danh sách tài khoản.");
            } finally {
                setLoading(false);
            }
        };

        fetchAccounts();
    }, []);

    return (
        <div className="container mt-5">
            {loading && <div className="alert alert-info" role="alert">Đang tải dữ liệu...</div>}
            {error && <div className="alert alert-danger" role="alert">{error}</div>}
            {!loading && !error && (
                <>
                    <h3 className="h3 mb-0 text-gray-800">Danh sách tài khoản</h3>
                    <table className="table table-striped mt-3">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Email</th>
                                <th>Trạng Thái</th>
                                <th>Vai trò</th>
                            </tr>
                        </thead>
                        <tbody>
                            {accounts.length > 0 ? (
                                accounts.map(account => (
                                    <tr key={account.uid}>
                                        <td>{account.uid || "N/A"}</td>
                                        <td>{account.email || "N/A"}</td>
                                        <td>{account.disabled ? "Đã bị khóa" : "Hoạt động"}</td>
                                        <td>{account.customClaims?.role || "N/A"}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center">Không có tài khoản nào</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </>
            )}
        </div>
    );
}

export default AccountComponents;
