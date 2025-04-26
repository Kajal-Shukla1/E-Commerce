import {create} from 'zustand';
import axios from '../lib/axios';
import {toast} from 'react-hot-toast';

export const useUserStore = create((set, get) => ({
    user:null,
    loading:false,
    checkingAuth :true,
    
    signup : async ({name,email,password,confirmPassword}) => {
        set({loading:true});
        if(password !== confirmPassword){
            set({loading:false});
            toast.error('Passwords do not match');
            return;
        }
        try {
            const res = await axios.post('/auth/signup',{ name, email, password });
            set({user: res.data.user,loading:false});
        } catch (error) {
            set({loading:false});
            toast.error(error.response.data.message || "An error occured, please try again");
        }
    }
}));