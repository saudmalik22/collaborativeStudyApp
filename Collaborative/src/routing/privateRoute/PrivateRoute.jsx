import {useSelector} from "react-redux";
import {Navigate} from "react-router-dom";


export const PrivateRoute=({children})=>{

    const user = useSelector((store)=>store.authSlice.user);

    return user ? children : <Navigate to="/login" />;
}