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

    fetchAllProducts: async () => {
        set({ loading: true });
        try {
            const res = await axios.get('/products');
            set({ products: res.data.products, loading: false });
        } catch (error) {
            set({ error: "Failed to fetch products",loading: false });
            toast.error(error.response.data.message || "Failed to fetch products");
        }
    },

    fetchProductsByCategory: async (category) => {
        set({ loading: true });
        try {
            const res = await axios.get(`/products/category/${category}`);
            set({ products: res.data.products, loading: false });
        } catch (error) {
            set({ error: "Failed to fetch products",loading: false });
            toast.error(error.response.data.message || "Failed to fetch products");
        }
    },
    
    deleteProduct :async (productId) => {
        set({ loading: true });
        try {
            await axios.delete(`/products/${productId}`);
            set((state) => ({
                products: state.products.filter((product) => product._id !== productId),
                loading: false,
            }));
            toast.success('Product deleted successfully!');
        } catch (error) {
            set({ loading: false });
            toast.error(error.response.data.message || "Failed to delete product");
        }
    },

    toggleFeaturedProduct: async (productId) => {
        set({ loading: true });
        try {
            const res = await axios.patch(`/products/${productId}`);
            //this will update the isFeatured property of the product in the products array
            set((prevProducts) => ({
                products : prevProducts.products.map((product) => 
                    product._id === productId ? { ...product, isFeatured: res.data.isFeatured } : product
                ),
                loading: false,
            }));
        } catch (error) {
            set({ loading: false });
            toast.error(error.response.data.message || "Failed to update product");
            
        }
    },
}));

