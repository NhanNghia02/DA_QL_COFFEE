import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';


function QuestionComment() {
    const [comments, setComments] = useState([
        { id: 1, name: "John Doe", comment: "Great service!", rating: 5 },
        { id: 2, name: "Jane Smith", comment: "Very satisfied!", rating: 4 },
    ]);

    const [newName, setNewName] = useState("");
    const [newComment, setNewComment] = useState("");
    const [newRating, setNewRating] = useState(1);
    const [errors, setErrors] = useState({ name: "", comment: "", rating: "" });

    const validateForm = () => {
        let valid = true;
        const newErrors = { name: "", comment: "", rating: "" };

        if (!newName.trim()) {
            newErrors.name = "Name is required.";
            valid = false;
        }

        if (!newComment.trim()) {
            newErrors.comment = "Comment is required.";
            valid = false;
        }

        if (!newRating) {
            newErrors.rating = "Rating is required.";
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
        };
        setComments([...comments, newCommentEntry]);
        setNewName("");
        setNewComment("");
        setNewRating(1);
        setErrors({ name: "", comment: "", rating: "" });
    };

    return (
        <div className="container my-4">
            <h2 className="text-primary text-center mb-4">Comments and Ratings</h2>

            <div className="card mb-4 p-4 shadow-sm">
                <div className="form-group">
                    <label htmlFor="commenterName">Name</label>
                    <input
                        type="text"
                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                        id="commenterName"
                        placeholder="Enter your name"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                    />
                    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>
                <div className="form-group">
                    <label htmlFor="commentText">Comment</label>
                    <textarea
                        className={`form-control ${errors.comment ? 'is-invalid' : ''}`}
                        id="commentText"
                        placeholder="Enter your comment"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    />
                    {errors.comment && <div className="invalid-feedback">{errors.comment}</div>}
                </div>
                <div className="form-group">
                    <label htmlFor="commentRating">Rating</label>
                    <select
                        className={`form-control ${errors.rating ? 'is-invalid' : ''}`}
                        id="commentRating"
                        value={newRating}
                        onChange={(e) => setNewRating(Number(e.target.value))}
                    >
                        {[1, 2, 3, 4, 5].map(r => (
                            <option key={r} value={r}>{r} Star{r > 1 && "s"}</option>
                        ))}
                    </select>
                    {errors.rating && <div className="invalid-feedback">{errors.rating}</div>}
                </div>
                <button className="btn btn-primary" onClick={handleAddComment}>Add Comment</button>
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
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default QuestionComment;
