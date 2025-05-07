import {useCartStore} from "..stores/useCartStore"
const CartPage = () => {
  const {cart} = useCartStore();
  return (
    <div className="py-8 md:py-16">
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <div className="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">

        </div>
      </div>
    </div>
  )
}

export default CartPage