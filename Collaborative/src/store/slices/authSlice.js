import {createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut} from 'firebase/auth';
import {setDoc, doc, getDoc, collection, getDocs} from 'firebase/firestore';
import {ref, uploadBytes, getDownloadURL} from 'firebase/storage';
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {auth, db, storage} from '../../config/config.js';

export const getCurrentUser = createAsyncThunk(
    "auth/currentUser",
    async (setLoading, store) => {
        try {
            setLoading(true)
            onAuthStateChanged(auth, async (user) => {
                if (user) {
                    const uid = user.uid;
                    const docSnap = await getDoc(doc(db, "users", uid))
                    const dbUser = docSnap?.data()
                    store.dispatch(setUser(dbUser))
                    console.log("dbUser", dbUser);
                    setLoading(false)
                } else {
                    setLoading(false)
                }
            });
            return
        } catch (error) {
            setLoading(false)
            console.log(error);

        }

    }
)





export const login = createAsyncThunk(
    "auth/login",
    async (user) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, user.email, user.password);
            console.log("userCredential in login", userCredential.user.uid);
            const docSnap = await getDoc(doc(db, "users", userCredential.user.uid));
            const dbUser = docSnap?.data();
            console.log("dbUser", dbUser);
            return dbUser
        } catch (error) {
            console.log("error", error);
        }
    }
)


export const Logout = createAsyncThunk(
    "auth/logout",
    async () => {
        try {
            await signOut(auth)
            return true
        } catch (error) {
            console.log("error in logout", error)
        }
    }
)
export const signUp = createAsyncThunk(
    'auth/signUp',
    async ({user, profileImage}) => {
        try {
            console.log("user in function", user);
            const userCredential = await createUserWithEmailAndPassword(auth, user.email, user.password);

            let saveUserTodb = {
                email: user.email,
                name: user.username,
                uid: userCredential.user.uid,
                profileImageUrl: null
            };
            if (profileImage) {
                const uniqueFileName = `${userCredential.user.uid}-${profileImage.name}`;
                const storageRef = ref(storage, `profileImages/${uniqueFileName}`);

                await uploadBytes(storageRef, profileImage);
                const profileImageUrl = await getDownloadURL(storageRef);
                console.log(" downloaded url", profileImageUrl)
                saveUserTodb.profileImageUrl = profileImageUrl;
            }


            await setDoc(doc(db, 'users', userCredential.user.uid), saveUserTodb);
            console.log("response after signup")
            return saveUserTodb;
        } catch (error) {
            console.error("Error in signup process:", error);
            throw error;
        }
    }
);
export const fetchUser = createAsyncThunk(
    "auth/fetchUser",
    async () => {
        try {
            const collectionRef = collection(db, "users");
            const snapshot = await getDocs(collectionRef);
            const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); // Map docs to an array of user objects
            console.log('Users fetched:', users);
            return users; // Return the array of users
        } catch (error) {
            console.log("Error fetching users:", error);
            throw error; // Ensure to throw the error to be handled in the extraReducers
        }
    }
);




export const authSlice=createSlice({
        name: "auth",
        initialState: {
            user: null,
            userNotes:[],
        },
        reducers: {
            setUser: (state, action) => {
                console.log("reducer in setuser", action.payload);
                state.user = action.payload
            }
        },
        extraReducers: (builder) => {
            builder.addCase(signUp.fulfilled, (state, action) => {
                state.user = action.payload
            });
            builder.addCase(login.fulfilled, (state, action) => {
                state.user = action.payload
            });
            builder.addCase(getCurrentUser.fulfilled, (state, action) => {
                console.log("reducer case in login", action.payload);
                state.user = action.payload
            });
            builder.addCase(Logout.fulfilled,(state,action)=>{
                state.user=action.payload
                state.user=null
            });
            builder.addCase(fetchUser.fulfilled, (state, action) => {
                state.userNotes = action.payload;
                state.loading = false;
            })
        }
    }
)
export const {setUser} = authSlice.actions
export default authSlice.reducer;