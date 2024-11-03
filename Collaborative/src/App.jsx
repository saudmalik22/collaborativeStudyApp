import {Routing} from "./routing/Routing.jsx";
import {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {getCurrentUser} from "./store/slices/authSlice.js";
import {Loader} from "./components/loader/Loader.jsx";


function App() {
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(getCurrentUser(setLoading))
    }, [])
  return (

      <>
          <div>
              {loading ? <h1><Loader/></h1> : <Routing/>}

          </div>
      </>
  )
}

export default App
