import { Navigate } from "react-router-dom"; 
import { useAuthStore } from "../store/store";

export const AuthorizeUser = ({children})=>{
    const token = localStorage.getItem('token');
    if(!token){
        return <Navigate to={'/'} replace={true} ></Navigate>
    }
    return children;
};
export const AuthorizeAdmin = ({ children }) => {
    const role = useAuthStore.getState().auth.role;
    const token = localStorage.getItem('token');
    if(!token){
        return <Navigate to={'/'} replace={true} ></Navigate>
    }
    if (token && role!=='admin') {
        return <Navigate to={'/profile'} replace={true} ></Navigate>
    }
    return children;
};
export const ProtectRoute = ({children}) => {
    const username = useAuthStore.getState().auth.username;
    const token = localStorage.getItem('token');
    if (token) {
        return <Navigate to={'/profile'} replace={true} ></Navigate>
    }
    if(!username){
        return <Navigate to={'/'} replace={true} ></Navigate>
    }
    return children;
}

