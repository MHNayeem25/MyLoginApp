import {create} from 'zustand';
import { devtools } from 'zustand/middleware'

export const useAuthStore = create(devtools((set)=>({
    auth:{
        username : '',
        profile : '',
        profile_id: '',
        //extra
        firstName: '',
        lastName: '',
        email: "",
        mobile: '',
        address: '',
        id : '',
        role: '',
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
        role: d.role,
        profile_id: d.profile_id
    }})),
    reset: () => set((state) => ({
        auth: {
            username: '',
            profile: '',
            profile_id: '',
            //extra
            firstName: '',
            lastName: '',
            email: "",
            mobile: '',
            address: '',
            id: '',
            role: '',
            active: false
        }
}))
}))
)



