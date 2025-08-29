import { useInsertOrderItems } from '@/api/order-items'
import { useInsertOrder } from '@/api/orders'
import { initialiseStripePaymentSheet, openPaymentSheet } from '@/lib/stripe'
import { randomUUID } from 'expo-crypto'
import { useRouter } from 'expo-router'
import { createContext, PropsWithChildren, useContext, useState } from 'react'
import { CartItem, Product, Tables } from 'types'

type CartType = {
  items: CartItem[]
  addItem: (product: Product, size: CartItem['size']) => void
  updateQuantity: (itemId: string, amount: -1 | 1) => void
  total: string
  onCheckout: () => void
}

const CartContext = createContext<CartType>({
  items: [],
  addItem: () => {},
  updateQuantity: () => {},
  total: '',
  onCheckout: () => {},
})

const CartProvider = ({ children }: PropsWithChildren) => {
  const [items, setItems] = useState<CartItem[]>([])
  const { mutate: insertOrder } = useInsertOrder()
  const { mutate: insertOrderItems } = useInsertOrderItems()
  const router = useRouter()

  // add new product to cart
  const addItem = (product: Product, size: CartItem['size']) => {
    const existingItem = items?.find((item) => item?.product === product && item?.size === size)

    if (existingItem) {
      updateQuantity(existingItem?.id, 1)
      return
    }

    const newCartItem: CartItem = {
      id: randomUUID(),
      product,
      product_id: product.id,
      size,
      quantity: 1,
    }

    setItems([newCartItem, ...items])
  }

  const updateQuantity = (itemId: string, amount: -1 | 1) => {
    const updatedItems = items
      ?.map((item) => (item.id !== itemId ? item : { ...item, quantity: item?.quantity + amount }))
      ?.filter((item) => item?.quantity > 0)

    setItems(updatedItems)
  }

  const total = items
    .reduce((sum, item) => (sum += item?.product?.price * item?.quantity), 0)
    ?.toFixed(2)

  const clearCart = () => {
    setItems([])
  }

  const onCheckout = async () => {
    await initialiseStripePaymentSheet(total * 100)
    const paid = await openPaymentSheet()
    if (!paid) return

    if (!total) return
    insertOrder(
      { total },
      {
        onSuccess: saveOrderItems,
      },
    )
  }

  const saveOrderItems = (order: Tables<'orders'>) => {
    const orderItems = items?.map((cartItem) => ({
      order_id: order?.id,
      product_id: cartItem?.product_id,
      quantity: cartItem?.quantity,
      size: cartItem?.size,
    }))
    insertOrderItems(orderItems, {
      onSuccess: () => {
        console.log('checkout done')
        clearCart()
        router.push(`/(user)/orders/${order?.id}`)
      },
      onError(error) {
        console.log('error: ', error)
      },
    })
  }

  return (
    <CartContext.Provider value={{ items, addItem, updateQuantity, total, onCheckout }}>
      {children}
    </CartContext.Provider>
  )
}
export default CartProvider

export const useCart = () => useContext(CartContext)
