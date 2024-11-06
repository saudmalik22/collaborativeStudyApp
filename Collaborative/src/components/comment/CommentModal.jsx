import { useEffect, useState } from "react";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { fetchComments, addComment } from "../../store/slices/commentSlice.js";

// eslint-disable-next-line react/prop-types
export const CommentModal = ({ isOpen, onClose, onSubmit, noteId }) => {
    const users = useSelector(store => store.authSlice.userNotes);
    const comments = useSelector(store => store.commentSlice.comments);

    const dispatch = useDispatch();
    const [comment, setComment] = useState("");
    const [error, setError] = useState("");
    const [commentCount, setCommentCount] = useState(comments.length);

    useEffect(() => {
        if (isOpen) {
            dispatch(fetchComments(noteId)); // Fetch comments on open
        }
    }, [noteId, dispatch, isOpen]);

    useEffect(() => {
        // Update comment count when the comments are fetched
        setCommentCount(comments.length);
    }, [comments]);

    const commentSchema = Yup.string()
        .trim()
        .min(1, "Comment cannot be empty.")
        .max(200, "Comment cannot exceed 200 characters.")
        .required("Comment is required.");

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        try {
            await commentSchema.validate(comment);
            onSubmit(comment);
            setCommentCount(prevCount => prevCount + 1);
            setComment("");
            setError("");
            onClose();
        } catch (validationError) {
            setError(validationError.message);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-md shadow-md w-96 max-w-full">
                <h2 className="text-lg font-semibold mb-4">Add a Comment</h2>
                <form onSubmit={handleCommentSubmit}>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Write a comment..."
                        className="w-full p-2 border border-gray-300 rounded mb-2"
                        rows="4"
                    ></textarea>
                    {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Comment
                        </button>
                    </div>
                </form>

                <div className="mt-6 space-y-4">
                    <p className="text-sm text-gray-600">
                        {commentCount} {commentCount === 1 ? "Comment" : "Comments"}
                    </p>

                    {/* Comments Section with Scrollbar */}
                    <div className="max-h-60 overflow-y-auto space-y-4"> {/* This is the scrollable container */}
                        {comments && comments.length > 0 ? (
                            comments.map((comment) => {
                                const user = users ? users.find((user) => user.uid === comment.userId) : null;
                                const commentWithUser = user ? { ...comment, userDetails: user } : comment;

                                // Safeguard: Check if 'createdAt' and 'seconds' exist before using it
                                const createdAt = commentWithUser.createdAt?.seconds
                                    ? new Date(commentWithUser.createdAt.seconds * 1000).toLocaleString()
                                    : "Unknown time";

                                return (
                                    <div key={commentWithUser.commentId} className="flex items-start space-x-3 bg-gray-100 p-4 rounded-md shadow-sm">
                                        <img
                                            src={commentWithUser.userDetails?.profileImageUrl || "/default-profile.png"}
                                            alt="User Profile"
                                            className="w-12 h-12 rounded-full border-2 border-gray-300"
                                        />
                                        <div className="flex-1">
                                            <p className="font-semibold text-sm">{commentWithUser.userDetails?.name || "Unknown User"}</p>
                                            <p className="text-sm mt-1">{commentWithUser.comment}</p>
                                            <p className="text-xs text-gray-500 mt-2">{createdAt}</p>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <p className="text-center text-gray-500">No comments yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
