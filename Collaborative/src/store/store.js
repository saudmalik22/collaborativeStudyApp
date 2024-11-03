import {configureStore} from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice.js";
import noteReducer from "./slices/noteSlice.js"
import commentReducer from "./slices/noteSlice.js"
export const store = configureStore(
    {
        reducer: {
            authSlice: authReducer,
            noteSlice:noteReducer,
            commentSlice:commentReducer,
        }
    }
)
