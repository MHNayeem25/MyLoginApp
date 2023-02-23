import axios from 'axios'
import jwt_decode from 'jwt-decode'

//axios.defaults.baseURL = "http://localhost:4000";
axios.defaults.baseURL = "https://loginapp-backend.onrender.com";

/** Make API Requests */

//Register user function
export async function registerUser(credentials){
    try{
        //Register user first
        const {status} = await axios.post('/api/register', credentials);

        let { username, email } = credentials;

        if (status === 200){
            //send mail
            await axios.post('/api/registerMail', { username, userEmail: email})
        }
    }catch(error){
        console.log(error);
        return Promise.reject({error});
    }
}

//Get user details (/me).get -- Use to login after registration
export async function userDetails(){
    try{
        const {user} = await axios.get('/api/me');
        // if(success===true){
        //     return Promise.resolve(data)
        // }
        return user;
    }catch(error){
        return Promise.reject({error});
    }
}

//Login user using username
export async function usernameLogin(username){
    try{
        const res =   await axios.post('/api/auth/username', {username});
        //console.log(res);
        return res;
    }catch(error){
        return {error : "Username doesn't exist..!", status : 401, data:""};
    }
}

//Take username to get profile pic.
export async function getUserProfile(username) {
    try {
        const res = await axios.post('/api/auth/username', { username });
        //console.log(res);
        //return res;
        if (res.status === 200) return Promise.resolve(res.data.user.profile);
    } catch (error) {
        return { error: "Username doesn't exist..!", status: 401, data: "" };
    }
}


//Login user using password
export async function passwordLogin(values) {
        //Testing await and promise
        // const logInPromise =  axios.post('/api/login', values);
        // console.log(logInPromise.state);
        // logInPromise.then(res =>{
        //     console.log(res);
        //     // return res.data.user;s
        // })
        // .catch( error =>{
        //     console.log(error);
        // })
        //await waits for axios-promise to resolve then only assigns
    const res = await axios.post('/api/login', values);

    //console.log(res.cookie);

    //const authToken = res.data.token;
    //localStorage.setItem("JWT", authToken);
    //console.log(res.data.token);
    const userData = res.data.user;
    const token = res.data.token;
    const info = {...userData, token};
    // console.log(info);
    if(res.status===200)    return Promise.resolve(info);
    return Promise.reject({ error: "Password Wrong..!" });
}

//check for authentication ans redirect to login page if no cookie present
// export async function auth(){
//     try{
//         const {success} = await axios.post('/api/me/auth');
//         if(success){
            
//         };
//         else    return Promise.reject();
//     }catch{
//         return Promise.reject({error});
//     }
// }

//Update user details
export async function updateUser(response){
    try{
        return  axios.put('/api/me/update', response);
        //console.log(res);
        //console.log(res);
        //return Promise.resolve({ data })
    } catch (error) {
        return error;
        //return Promise.reject({ error: "Couldn't Update Profile...!" })
    }
}


//Logout
export async function logoutUser(){
    try{
        //console.log("Success")
        const {success} = await axios.get('/api/logout');
        if(success){
            return Promise.resolve();
        }
    }catch(error){
        return Promise.reject({ error });
    }
}

//Update password for logged in users
export async function changePassword({credentials}){
    try{
        const {user} = await axios.put('/api/password/update', credentials);
        return Promise.resolve({ user });
    } catch (error) {
        return Promise.reject({ error: "Couldn't Update Profile...!" })
    }
}

//jwt decode
export async function getUsername(){
    const token = localStorage.getItem('token');
    if(!token) return Promise.reject("Cannot find token.");
    let decode = jwt_decode(token);
    //const request = {id:decode}
    try{
        const response = await axios.post('/api/me', decode);
        //console.log(response.data.user);
        return Promise.resolve(response.data.user) ;
    }catch(error){
        return error;
    }
}

//send otp for password reset
export async function sendOtp(user){
    try{
        const data = {
            username : user
        }
        return await axios.put('/api/password/forgot', data);
    }catch(error){
        return error;
    }
}

export async function verifyOtp(otpData){
    try{
        const data = {otp:otpData};
        return axios.put('/api/password/verify', data);
    }catch(error){
        return error;
    }
}

//Reset password
export async function resetPassword(credentials){
   try{
       return axios.put('/api/me/password/reset', credentials);
   }catch(error){
        return error;
   }
}

