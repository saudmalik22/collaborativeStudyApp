import React, {useEffect, useState} from 'react';
import * as Yup from 'yup';
import {useDispatch, useSelector} from "react-redux";
import {addNotes, updateNote} from "../../store/slices/noteSlice.js";
import { v4 as uuidv4 } from 'uuid';
import {date} from "yup";
import {useNavigate, useParams} from "react-router-dom";

export const Addnote = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [subject, setSubject] = useState("");
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState("");
    const user = useSelector(store => store.authSlice.user);
      const dispatch = useDispatch();
    const { id } = useParams();
    const existingNote = useSelector((state) =>
        state.noteSlice.note.find((note) => note.id === id)
    );
    const navigate= useNavigate();
    useEffect(() => {
        if (id && existingNote) {
            setTitle(existingNote.title);
            setContent(existingNote.content);
            setSubject(existingNote.subject);
        }
    }, [id, existingNote]);

    const validationSchema = Yup.object().shape({
        title: Yup.string()
            .min(3, 'Title must be at least 3 characters')
            .max(100, 'Title can be at most 100 characters')
            .required('Title is required'),
        content: Yup.string()
            .min(10, 'Content must be at least 10 characters')
            .required('Content is required'),
        subject: Yup.string()
            .required('Please select a subject'),
    });

    const handleNoteSubmit = async (e) => {
        e.preventDefault();
        let note = {

            userId: user.uid,
            title,
            content,
            subject,
        }
        if (id) {
            dispatch(updateNote({id, ...note}));
            setTitle("");
            setSubject("");
            setContent("");
            navigate("/")
            setSuccessMessage("Note updated successfully!");
        } else {
            try {
                await validationSchema.validate(note, {abortEarly: false});
                setErrors({});
                dispatch(addNotes(note))
                setTitle("");
                setContent("");
                setSubject("");

                setSuccessMessage("Note added successfully!");
            } catch (validationErrors) {
                // Collect validation errors and set them in state
                const formattedErrors = {};
                validationErrors.inner.forEach((error) => {
                    formattedErrors[error.path] = error.message;
                });
                setErrors(formattedErrors);
            }
        }

    }

    return (
        <div className="max-w-lg mx-auto bg-gradient-to-r from-indigo-50 to-indigo-100 p-8 mt-12 rounded-2xl shadow-lg space-y-6">
            <h2 className="text-2xl font-bold text-indigo-700 mb-4 text-center">{id ? "Edit Note" : "Add Note"}</h2>
            {successMessage && <p className="text-green-600 text-center">{successMessage}</p>} {/* Display the success message */}
                {/* Title Field */}
                <div>
                    <label className="block text-indigo-600 font-semibold mb-2">Title</label>
                    <input
                        type="text"
                        name="title"
                        className="w-full px-4 py-3 border border-indigo-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring focus:ring-indigo-200"
                        placeholder="Enter note title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    {errors.title && <p className="text-red-600 text-sm">{errors.title}</p>}
                </div>

                {/* Content Field */}
                <div>
                    <label className="block text-indigo-600 font-semibold mb-2">Content</label>
                    <textarea
                        name="content"
                        rows="5"
                        className="w-full px-4 py-3 border border-indigo-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring focus:ring-indigo-200"
                        placeholder="Write your note here..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                    {errors.content && <p className="text-red-600 text-sm">{errors.content}</p>}
                </div>

                {/* Subject/Category Dropdown */}
                <div>
                    <label className="block text-indigo-600 font-semibold mb-2">Subject/Category</label>
                    <select
                        name="subject"
                        className="w-full px-4 py-3 border border-indigo-300 rounded-lg bg-white focus:outline-none focus:border-indigo-500 focus:ring focus:ring-indigo-200"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                    >
                        <option value="" disabled>Select a category</option>
                        <option value="Math">Math</option>
                        <option value="Science">Science</option>
                        <option value="Literature">Literature</option>
                        <option value="History">History</option>
                        <option value="Art">Art</option>
                        <option value="Music">Music</option>
                    </select>
                    {errors.subject && <p className="text-red-600 text-sm">{errors.subject}</p>}
                </div>



                <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition duration-200 ease-in-out transform hover:scale-105"
                onClick={handleNoteSubmit}
                >
                    {id ? "Update Note" : "Save Note"}
                </button>

        </div>
    );
};
