import {useCartStore} from "..stores/useCartStore"
const CartPage = () => {
  const {cart} = useCartStore();
  return (
    <div>CartPage</div>
  )
}

export default CartPage