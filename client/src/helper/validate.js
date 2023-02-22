import toast from 'react-hot-toast'
import {usernameLogin } from './helper';
// import { useAuthStore } from '../store/store'


/** Validate login page username whether it exists in  */
export async function usernameValidate(values){
    const errors = usernameVerify({}, values);  //function
    if(values.username){
        //check if user exist or not
        const { status} = await usernameLogin(values.username);
        //console.log(data.profile);
        // useAuthStore.setState({profile : data.user.profile});
        
        //console.log(status);
        if(status!==200){
            errors.exist = toast.error("User does not exist");
            return errors;
        }
        
    }
}

/** verify password */
function passwordVerify(errors={}, values){
    // eslint-disable-next-line
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    if(!values.password){
        errors.password = toast.error("Password Required..!");
     }else if(values.password.includes(' ')){
        errors.password = toast.error("Wrong Password...!");
     }else if(values.password.length < 4){
        errors.password = toast.error("Password must be more than 4 characters.")
     }else if(!specialChars.test(values.password)){
        errors.password = toast.error("Password must have special character..!")
     }
     return errors;
}

/** Validate password */
export async function passwordValidate(values){
    const errors = passwordVerify({},values);
    //console.log(values);
    return errors;
}
/** Validate username */


function usernameVerify(error = {}, values){
    if(!values.username){
        error.username = toast.error('Username Required...!');
    }else if(values.username.includes(' ')){
        error.username = toast.error('Invalid Username...!');
    }
    return error;

}

/** Validate reset password */
export async function resetPasswordValidation(values){
    const errors = passwordVerify({},values);
    if(!errors.password){
        if (values.password !== values.confirm_pwd) {
            errors.exist = toast.error("Password does not match.")
        }
    }
    
    return errors;
}

/** Validate Register form */
export async function registerValidation(values){
    const errors = usernameVerify({},values);
    passwordVerify(errors, values);
    emailVerify(errors,values)
    return errors;
}

/** Email Verify */
function emailVerify(error = {}, values){
    if(!values.email){
        error.email = toast.error("Email Required..!");
    }else if(values.email.includes(' ')){
        error.email = toast.error("Wrong Email..!")
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)){
        error.email = toast.error("Invalid email address...!")
    }
    return error;
}

//** Validate profile page */
export async function profileValidation(values){
    const errors = emailVerify({},values);
    return errors;
}