import {create} from 'zustand';
import axios from '../lib/axios';
import {toast} from 'react-hot-toast';


export const useProductStore = create((set) => ({
    products: [],
    loading: false,
   
    setProducts: (products) => set({ products }),

    createProduct: async (newProduct) => {
        set({ loading: true });
        try {
            const res = await axios.post('/products', newProduct);
            set((state) => ({ products: [...state.products, res.data], loading: false }));
            toast.success('Product created successfully!');
        } catch (error) {
            set({ loading: false });
            toast.error(error.response.data.message );
        }
    },
}));

