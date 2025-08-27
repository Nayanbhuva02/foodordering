import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useMemo } from 'react'
import { Link, Stack, useLocalSearchParams } from 'expo-router'
import { products } from '@/assets/data/products'
import { FontAwesome } from '@expo/vector-icons'
import Colors from '@/constants/Colors'


const ProductDetails = () => {
    const { id } = useLocalSearchParams()

    const product = useMemo(() => {
        return products.find(val => val?.id?.toString() === id)
    }, [id])


    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: product?.name }} />
            <Stack.Screen options={{
                title: "Menu ", headerRight: () => (
                    <Link href={`/(admin)/menu/create?id=${id}`} asChild>
                        <Pressable>
                            {({ pressed }) => (
                                <FontAwesome
                                    name="pencil"
                                    size={25}
                                    color={Colors.light.tint}
                                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                                />
                            )}
                        </Pressable>
                    </Link>
                )
            }} />



            <Image source={{ uri: product?.image }} style={styles.image} />

            <View>
                <Text style={styles.price}>Name: {product?.name}</Text>
                <Text style={styles.price}>${product?.price}</Text>
            </View>
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
})