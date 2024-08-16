import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

function CommentComponent() {
    const [comments, setComments] = useState([
        { id: 1, name: "John Doe", comment: "Great service!", rating: 5, replies: [] },
        { id: 2, name: "Jane Smith", comment: "Very satisfied!", rating: 4, replies: [] },
    ]);

    const [newName, setNewName] = useState("");
    const [newComment, setNewComment] = useState("");
    const [newRating, setNewRating] = useState(1);
    const [errors, setErrors] = useState({ name: "", comment: "", rating: "" });
    const [replyCommentId, setReplyCommentId] = useState(null);
    const [replyComment, setReplyComment] = useState("");

    const validateForm = () => {
        let valid = true;
        const newErrors = { name: "", comment: "", rating: "" };

        if (!newName.trim()) {
            newErrors.name = "Tên không được để trống.";
            valid = false;
        }

        if (!newComment.trim()) {
            newErrors.comment = "Bình luận không được để trống.";
            valid = false;
        }

        if (!newRating) {
            newErrors.rating = "Đánh giá không được để trống.";
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleAddComment = () => {
        if (!validateForm()) return;

        const newCommentEntry = {
            id: comments.length + 1,
            name: newName,
            comment: newComment,
            rating: newRating,
            replies: [],
        };
        setComments([...comments, newCommentEntry]);
        setNewName("");
        setNewComment("");
        setNewRating(1);
        setErrors({ name: "", comment: "", rating: "" });
    };

    const handleDeleteComment = (id) => {
        const updatedComments = comments.filter(comment => comment.id !== id);
        setComments(updatedComments);
    };

    const handleReplyComment = (id) => {
        if (!replyComment.trim()) {
            alert("Phản hồi không được để trống.");
            return;
        }

        const updatedComments = comments.map(comment => {
            if (comment.id === id) {
                return { ...comment, replies: [...comment.replies, replyComment] };
            }
            return comment;
        });
        setComments(updatedComments);
        setReplyCommentId(null);
        setReplyComment("");
    };

    return (
        <div className="container my-4">
            <h2 className="text-primary text-center mb-4">Bình luận và Đánh giá</h2>

            <div className="card mb-4 p-4 shadow-sm">
                <div className="form-group">
                    <label htmlFor="commenterName">Tên</label>
                    <input
                        type="text"
                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                        id="commenterName"
placeholder="Nhập tên của bạn"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                    />
                    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>
                <div className="form-group">
                    <label htmlFor="commentText">Bình luận</label>
                    <textarea
                        className={`form-control ${errors.comment ? 'is-invalid' : ''}`}
                        id="commentText"
                        placeholder="Nhập bình luận của bạn"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    />
                    {errors.comment && <div className="invalid-feedback">{errors.comment}</div>}
                </div>
                <div className="form-group">
                    <label htmlFor="commentRating">Đánh giá</label>
                    <select
                        className={`form-control ${errors.rating ? 'is-invalid' : ''}`}
                        id="commentRating"
                        value={newRating}
                        onChange={(e) => setNewRating(Number(e.target.value))}
                    >
                        {[1, 2, 3, 4, 5].map(r => (
                            <option key={r} value={r}>{r} Sao</option>
                        ))}
                    </select>
                    {errors.rating && <div className="invalid-feedback">{errors.rating}</div>}
                </div>
                <button className="btn btn-primary" onClick={handleAddComment}>Thêm bình luận</button>
            </div>

            <ul className="list-group shadow-sm">
                {comments.map((comment) => (
                    <li key={comment.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                            <div className="font-weight-bold">{comment.name}</div>
                            <div className="text-muted">{comment.comment}</div>
                            <div className="text-warning">
                                {"★".repeat(comment.rating)}{"☆".repeat(5 - comment.rating)}
                            </div>
                            {comment.replies.length > 0 && (
                                <ul className="mt-2">
                                    {comment.replies.map((reply, index) => (
                                        <li key={index} className="text-muted">{reply}</li>
                                    ))}
                                </ul>
                            )}
                            {replyCommentId === comment.id && (
                                <div className="mt-2">
                                    <textarea
                                        className="form-control"
placeholder="Nhập phản hồi của bạn"
                                        value={replyComment}
                                        onChange={(e) => setReplyComment(e.target.value)}
                                    />
                                    <button
                                        className="btn btn-sm btn-success mt-2"
                                        onClick={() => handleReplyComment(comment.id)}
                                    >
                                        Phản hồi
                                    </button>
                                    <button
                                        className="btn btn-sm btn-secondary mt-2"
                                        onClick={() => setReplyCommentId(null)}
                                    >
                                        Hủy
                                    </button>
                                </div>
                            )}
                        </div>
                        <div>
                            <button
                                className="btn btn-sm btn-primary mr-2"
                                onClick={() => setReplyCommentId(comment.id)}
                            >
                                Phản hồi
                            </button>
                            <button
                                className="btn btn-sm btn-danger"
                                onClick={() => handleDeleteComment(comment.id)}
                            >
                                Xóa
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default CommentComponent;