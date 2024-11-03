import {Link} from "react-router-dom";


export const Button=()=>{
    return(
        <Link to="/addNotes" className="fixed bottom-5 right-5 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full shadow-lg transition duration-200">
            Add Note
        </Link>
    )
}