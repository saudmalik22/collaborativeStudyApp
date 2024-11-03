import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import {Home} from "../pages/home/Home.jsx";
import {SignUp} from "../pages/signUp/SignUp.jsx";
import {Login} from "../pages/login/Login.jsx";
import {AddNote} from "../pages/addnotes/AddNote.jsx";
import {PrivateRoute} from "./privateRoute/PrivateRoute.jsx";
import {PublicRoute} from "./publicRoute/PublicRoute.jsx";

 export const Routing=()=>{


     const router=createBrowserRouter([
         {
             path:"/",
             element:<PrivateRoute><Home/></PrivateRoute>
         },
         {
             path:"/signup",
             element:<PublicRoute><SignUp/></PublicRoute>
         },
         {
             path:"/login",
             element:<PublicRoute><Login/></PublicRoute>
         },
         {
             path:"/addNotes/:id?",
             element:<PrivateRoute><AddNote/></PrivateRoute>
         }
     ])
    return(
        <RouterProvider router={router}/>
    )
 }