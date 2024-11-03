import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import { collection, addDoc, getDocs, onSnapshot, query, where, orderBy, limit, doc, deleteDoc, setDoc, updateDoc } from "firebase/firestore";
import {db} from "../../config/config.js";
import { v4 as uuidv4 } from 'uuid';

export const  getNotes = createAsyncThunk(
    "notes/getNots",
    async () => {
        try {
            const collectionRef = collection(db, "notes");
            const queryRef = query(collectionRef);
            const docs = await getDocs(queryRef);

            let notes = [];
            docs.forEach((doc) => {
                notes.push({ id: doc.id, ...doc.data() });
            });
            // console.log("",notes);
            return notes;
        } catch (error) {
            console.log(error);
        }
    }
)


export const updateNote = createAsyncThunk(
    "notes/updateNote",
    async (note) => {
        try {
            const docRef = doc(db, "notes", note.id);
            await updateDoc(docRef, {
                title: note.title,
                content: note.content,
                subject:note.subject
            });
            return { id: note.id, ...note };
        } catch (error) {
            console.error("Error updating post:", error);
            throw error;
        }
    }
);


export const addNotes =createAsyncThunk(
    "notes/addNotes",
    async(noteData)=>{
        try {
            const note = {
                noteId: uuidv4(),
                userId: noteData.userId,
                title: noteData.title,
                content: noteData.content,
                subject: noteData.subject,
                createdAt: new Date(),
                createdBy: noteData.userId,
                lastEditedBy: noteData.userId,
                lastEditedAt: new Date(),
            };
          const collectionRef=collection(db,"notes");
          const response = await addDoc(collectionRef,note)
            console.log("response in slice add function",response);
          return response
        }catch (error){
            console.log("error in add notes",error)
        }
    }
)



export const deleteNote=createAsyncThunk(
    "notes/deleteNote",
    async (id)=>{
        try {
            const docRef =doc(db,"notes",id);
            await deleteDoc(docRef);
            return id;
        }catch (error){
            console.log("error",error);
        }
    }
)




export const noteSlice=createSlice({
        name: "notes",
        initialState: {
            note:[],
        },
        reducers:{

        },
       extraReducers:(builder)=>{
            builder.addCase(getNotes.fulfilled,(state,action)=>{
                state.note= action.payload
            });
            builder.addCase(addNotes.fulfilled, (state, action) => {
                state.note.push(action.payload);
           });
           builder.addCase(deleteNote.fulfilled, (state, action) => {
               state.note = state.note.filter((note) => note.id !== action.payload);
           });
           builder
               .addCase(updateNote.fulfilled, (state, action) => {
                   const index = state.notes.findIndex(note => note.id === action.payload.id);
                   if (index !== -1) {
                       state.notes[index] = { ...state.notes[index], ...action.payload };
                   }
               });

       }
    }
)
export default noteSlice.reducer;