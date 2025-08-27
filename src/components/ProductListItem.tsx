import { Image, Pressable, StyleSheet, Text } from 'react-native'
import React from 'react'
import Colors from '@/constants/Colors'
import { products } from '@/assets/data/products'
import { Link, useSegments } from 'expo-router'

const ProductListItem = ({ product }: { product: typeof products[0] }) => {
    const segments = useSegments();

    return (
        <Link href={`/${segments[0]}/menu/${product.id}`} asChild>
            <Pressable style={styles.container}>
                <Image source={{ uri: product.image }} style={styles.image} />

                <Text style={styles.title}>{product.name}</Text>
                <Text style={styles.price}>${product.price}</Text>
            </Pressable>
        </Link>
    )
}

export default ProductListItem

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 10,
        flex: 1,
        maxWidth: '50%'
    },
    image: {
        width: '100%',
        aspectRatio: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        marginTop: 10,
    },
    price: {
        fontSize: 14,
        color: Colors.light.tint
    },
})