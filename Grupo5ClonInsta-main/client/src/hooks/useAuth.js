import { useContext } from "react"
import {AuthContext} from "../contexts/AuthContext.jsx"

function useAuth() {
  return useContext(AuthContext)
}

export default useAuth;
