import {useSelector} from "react-redux";
import {Navigate} from "react-router-dom";


export const PublicRoute=({children})=>{
    const user = useSelector((store)=>store.authSlice.user);
    return user ? <Navigate to="/" /> : children;
}