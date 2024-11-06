import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import { collection, addDoc, getDocs, onSnapshot, query, where, orderBy, limit, doc, deleteDoc, setDoc, updateDoc } from "firebase/firestore";
import {db} from "../../config/config.js";



export const fetchComments = createAsyncThunk(
    "comments/fetchComments",
    async (noteId) => {
        try {
            const commentsRef = collection(db, "notes", noteId, "comments");
            const snapshot = await getDocs(commentsRef);

            const comments = snapshot.docs.map(doc => ({
                commentId: doc.id,
                ...doc.data()
            }));

            console.log("Fetched comments:", comments);
            return comments;
        } catch (error) {
            console.log("Error fetching comments:", error);
            throw error;
        }
    }
);




export const addComment = createAsyncThunk(
    "comments/addComment",
    async (userComment ) => {
        try {
            const collectionRef = collection(db, "notes", userComment.noteId, "comments");
            await addDoc(collectionRef, userComment);
            return userComment;
        } catch (error) {
            console.log("Error in addComment function:", error);

        }
    }
);


export const commentSlice=createSlice(
    {
        name:"comments",
        initialState:{
            comments:[],
            likedNotes: [],
        },
        reducers:{
            likes:(state, action)=>{
                const noteId = action.payload;
                if (state.likedNotes.includes(noteId)) {
                    // If the note is already liked, remove it (decrement)
                    state.likedNotes = state.likedNotes.filter(id => id !== noteId);
                } else {
                    // If not liked, add it (increment)
                    state.likedNotes.push(noteId);
                }
}
        },
        extraReducers:(builder)=>{
            builder.addCase(addComment.fulfilled ,(state,action)=>{
                state.comments.push(action.payload)
            });
            builder.addCase(fetchComments.fulfilled,(state,action)=>{

               state.comments= action.payload
                console.log("Fetched comments:", action.payload);
            })
        }
    }
)

export const {likes}= commentSlice.actions

export default commentSlice.reducer;