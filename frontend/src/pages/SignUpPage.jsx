import {useState} from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, Mail , Lock, ArrowRight, Loader } from 'lucide-react';
import { motion } from 'framer-motion';

const SignUpPage = () => {
    const loading = true;

    const[formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
    }

    return(
        <div className='flex flex-col justify-center py-12 sm:px-6 lg:px-8'>
            <motion.div initial={{ opacity: 0, y:20 }} animate={{ opacity: 1, y:0 }} transition={{ duration: 0.8 }}>
                <h2 className='mt-6 text-3xl font-extrabold text-emerald-400 text-center'>Create your account</h2>
            </motion.div>

        </div>
    )
}

export default SignUpPage;