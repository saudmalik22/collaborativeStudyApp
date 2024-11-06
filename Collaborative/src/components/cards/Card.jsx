import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { deleteNote, getNotes } from "../../store/slices/noteSlice.js";
import { fetchUser } from "../../store/slices/authSlice.js";
import { FaEdit, FaTrashAlt, FaCommentDots, FaThumbsUp } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { CommentModal } from "../comment/CommentModal.jsx";
import { v4 as uuidv4 } from 'uuid';
import {addComment, likes} from "../../store/slices/commentSlice.js";

export const Card = () => {
    const dispatch = useDispatch();
    const notes = useSelector((store) => store.noteSlice.note);
    const users = useSelector((store) => store.authSlice.userNotes);
    const user = useSelector(store =>store.authSlice.user);
    const likesNotes = useSelector(store=>store.commentSlice.likedNotes)
    const navigate = useNavigate();
    const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
    const [currentNoteId, setCurrentNoteId] = useState(null);

    useEffect(() => {
        dispatch(getNotes());
        dispatch(fetchUser());
    }, [dispatch]);

    const handleDelete = (id) => {
        const confirm = window.confirm("Are you sure you want to delete this note?");
        if (confirm) {
            dispatch(deleteNote(id));
        }
    };

    const handleEdit = (id) => {
        navigate(`/addNotes/${id}`);
    };

    const handleCommentClick = (id) => {
        setCurrentNoteId(id);
        setIsCommentModalOpen(true);
    };

    const closeCommentModal = () => {
        setIsCommentModalOpen(false);
        setCurrentNoteId(null);
    };

    const handleComment = (comment) => {
        console.log("Comment submitted for note", currentNoteId, ":", comment);
        const userComment={
            commentId:uuidv4(),
            noteId: currentNoteId,
            comment,
            userId:user.uid,
            createdAt: new Date(),
        };
        dispatch(addComment(userComment))
        console.log("comment data after variable",userComment);
        closeCommentModal();
    };


    const handleLike =(noteId)=>{
        dispatch(likes(noteId))
    }

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 p-4 mt-16">
            {notes &&
                notes.map((note) => {
                    const user = users ? users.find((user) => user.uid === note.userId) : null;
                    const noteWithUser = user ? { ...note, userDetails: user } : note;
                    const isLiked = likesNotes.includes(note.id)
                    return (
                        <div key={note.id} className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
                            <div className="top-1 ml-4 flex justify-end space-x-2">
                                <button
                                    onClick={() => handleEdit(note.id)}
                                    className="text-blue-600 hover:text-blue-800 p-1 rounded-full focus:outline-none"
                                    title="Edit Note"
                                >
                                    <FaEdit/>
                                </button>
                                <button
                                    onClick={() => handleDelete(note.id)}
                                    className="text-red-600 hover:text-red-800 p-1 rounded-full focus:outline-none"
                                    title="Delete Note"
                                >
                                    <FaTrashAlt/>
                                </button>
                            </div>
                            <div className="flex items-center mb-4 bg-blue-100 p-3 rounded-lg">
                                <img
                                    src={noteWithUser.userDetails?.profileImageUrl || ""}
                                    alt="User Profile"
                                    className="w-12 h-12 rounded-full mr-4 border-2 border-blue-400"
                                />
                                <div>
                                    <h3 className="text-lg font-semibold text-blue-700">
                                        {noteWithUser.userDetails?.name || "Unknown User"}
                                    </h3>
                                    <p className="text-blue-500 text-sm">
                                        {noteWithUser?.createdAt?.seconds
                                            ? new Date(noteWithUser?.createdAt?.toDate()).toLocaleDateString()
                                            : new Date(noteWithUser?.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            <h4 className="text-xl font-bold mb-2 text-gray-800">
                                {noteWithUser.title || "No Title"}
                            </h4>
                            <span
                                className="bg-blue-200 text-blue-900 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">
                                {noteWithUser.subject || "Uncategorized"}
                            </span>
                            <p className="text-gray-700 mt-3">
                                {noteWithUser.content || "No content available."}
                            </p>
                            <div className="flex justify-between mt-4">
                                <button
                                    onClick={() => handleLike(note.id)}
                                    className={`text-blue-600 hover:text-blue-800 mt-4 flex items-center ${isLiked ? 'text-blue-800' : ''}`}
                                >
                                    <FaThumbsUp className="mr-2"/>
                                    {isLiked ? "Liked" : "Like"}
                                </button>
                                <button
                                    onClick={() => handleCommentClick(note.id)}
                                    className="text-blue-600 hover:text-blue-800 mt-4 flex items-center"
                                >
                                    <FaCommentDots className="mr-2"/>
                                    Comment
                                </button>
                            </div>
                        </div>
                    );
                })}
            <CommentModal
                isOpen={isCommentModalOpen}
                onClose={closeCommentModal}
                noteId={currentNoteId}
                onSubmit={(comment) => handleComment(comment)}
            />
        </div>
    );
};
