import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {deleteNote, getNotes} from "../../store/slices/noteSlice.js";
import { fetchUser } from "../../store/slices/authSlice.js";
import {FaEdit, FaTrashAlt} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export const Card = () => {
    const dispatch = useDispatch();
    const notes = useSelector((store) => store.noteSlice.note);
    const users = useSelector((store) => store.authSlice.userNotes);
    const navigate = useNavigate();
    useEffect(() => {
        dispatch(getNotes());
        dispatch(fetchUser());
    }, [dispatch]);

    const handleDelete=(id)=>{
        const confirm= window.confirm("are you sure you want to delete thi note");
        if (confirm) {
            console.log("button is clicked", id);
            dispatch(deleteNote(id))
        }else {
            console.log("notes delete cancel");
        }

    }


    function handleEdit(id) {
        console.log(" edit button is clicked",id);
        navigate(`/addNotes/${id}`);
    }

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 p-4 mt-16">
            {(notes) && notes.map((note) => {
                const user = (users) ? users.find((user) => user.uid === note.userId) : null;
                const noteWithUser = user ? { ...note, userDetails: user } : note;

                return (
                    <div key={note.id} className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
                        <div className=" top-1 ml-4 flex justify-end space-x-2">
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
                        {/* User Info Section */}
                        <div className="flex items-center mb-4 bg-blue-100 p-3 rounded-lg">
                            <img
                                src={noteWithUser.userDetails?.profileImageUrl
                                    || ""}
                                alt="User Profile"
                                className="w-12 h-12 rounded-full mr-4 border-2 border-blue-400"
                            />
                            <div>
                                <h3 className="text-lg font-semibold text-blue-700">
                                    {noteWithUser.userDetails?.name || "Unknown User"}
                                </h3>
                                <p className="text-blue-500 text-sm">
                                    {noteWithUser?.createdAt?.seconds ? new Date(noteWithUser?.createdAt?.toDate()).toLocaleDateString() : new Date(noteWithUser?.createdAt).toLocaleDateString()}

                                </p>
                            </div>
                        </div>

                        {/* Note Content */}
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
                    </div>
                );

            })}
        </div>
    );
};
