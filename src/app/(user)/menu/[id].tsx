import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { Stack, useLocalSearchParams } from 'expo-router'
import { PizzaSize } from 'types'
import Button from '@/components/Button'
import { useCart } from '@/providers/CartProvider'
import { useProduct } from '@/api/products'
import { defaultPizzaImage } from '@/constants/Images'
import RemoteImage from '@/components/RemoteImage'

const sizes: PizzaSize[] = ['S', 'M', 'L', 'XL']

const ProductDetails = () => {
  const { id: idString } = useLocalSearchParams()
  const id = parseFloat(typeof idString === 'string' ? idString : idString[0])
  const { addItem } = useCart()

  const { data: product } = useProduct(id)

  const [selectedSize, setSelectedSize] = useState<PizzaSize>('M')

  const onAddCart = () => {
    if (!product || !selectedSize) return
    addItem(product, selectedSize)
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: product?.name || '' }} />

      <RemoteImage path={product?.image} fallback={defaultPizzaImage} style={styles.image} />

      <Text>Select size</Text>
      <View style={styles.sizes}>
        {sizes.map((size) => (
          <Pressable
            onPress={() => {
              setSelectedSize(size)
            }}
            style={[
              styles.size,
              {
                backgroundColor: selectedSize === size ? 'gainsboro' : 'white',
              },
            ]}
            key={size}
          >
            <Text
              style={[
                styles.sizeText,
                {
                  color: selectedSize === size ? 'black' : 'gray',
                },
              ]}
            >
              {size}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.price}>${product?.price}</Text>
      <Button text="Add To Cart" onPress={onAddCart} />
    </View>
  )
}

export default ProductDetails

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    padding: 10,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 'auto',
  },

  sizes: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  size: {
    backgroundColor: 'gainsboro',
    width: 50,
    aspectRatio: 1,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sizeText: {
    fontSize: 20,
    fontWeight: '500',
  },
})
