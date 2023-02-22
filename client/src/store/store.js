import {create} from 'zustand';
import { devtools } from 'zustand/middleware'

// const initialValues = {
//     username: '',
//     profile: '',
//     //extra
//     firstName: '',
//     lastName: '',
//     email: "",
//     mobile: '',
//     address: '',
//     id: '',
//     active: false
// }
export const useAuthStore = create(devtools((set)=>({
    auth:{
        username : '',
        profile : '',
        //extra
        firstName: '',
        lastName: '',
        email: "",
        mobile: '',
        address: '',
        id : '',
        active : false
    },
    setUsername : (name) => set( (state) => ({auth : { ...state.auth, username : name}})),
    setProfile : (pf) => set( (state) => ({auth : {...state.auth, profile : pf}})),
    setExtra    : (d)   => set( (state) => ({auth : {...state.auth, 
        firstName: d.firstName,
        lastName:d.lastName,
        email:d.email,
        address:d.address,
        mobile:d.mobile,
        id: d._id,
    }})),
    reset: () => set((state) => ({
        auth: {
            username: '',
            profile: '',
            //extra
            firstName: '',
            lastName: '',
            email: "",
            mobile: '',
            address: '',
            id: '',
            active: false
        }
}))
}))
)



