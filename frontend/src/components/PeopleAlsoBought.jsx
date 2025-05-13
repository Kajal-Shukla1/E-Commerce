import { useEffect, useState } from "react"
import ProductCard from "./ProductCard"
import LoadingSpinner from "./LoadingSpinner"
import axios from "../lib/axios"
import toast from "react-hot-toast"

const PeopleAlsoBought = () => {
  const [recommendations , setRecommendations] = useState([])
  const [isLoading,setIsLoading] = useState(true)

  useEffect(() => {
    const fetchRecommendation = async () => {
      try{
        const res= await axios.get("/products/recommendations");
        setRecommendations(res.data);
      } catch(error){
        toast.error(error.response.data.message || "An error occured while fetching Recommendations");
      }
      finally{
        setIsLoading(false);
      }
    };

    fetchRecommendation();
  },[]);

  if (isLoading) return <LoadingSpinner/>

  return (
    <div className='mt-8'>
      <h3 className="text-2xl font-semibold text-emerald-400">People also bought</h3>
      <div className="flex mt-6 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" >
        {recommendations.map((product)=> (
          <ProductCard key={product._id} product={product}/>
        ))}
      </div>
    </div>
  )
}

export default PeopleAlsoBought