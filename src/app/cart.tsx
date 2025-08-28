import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import { useCart } from '@/providers/CartProvider'
import CartListItem from '@/components/CartListItem'
import Button from '@/components/Button'

const Cart = () => {
    const { items, total, onCheckout } = useCart()

    return (
        <View style={{ flex: 1, paddingBottom: 20 }}>
            <FlatList
                data={items}
                renderItem={({ item }) => <CartListItem cartItem={item} />}
                keyExtractor={(_, i) => i?.toString()}
                contentContainerStyle={styles.listContainer}
            />
            {total ? <View style={{ paddingHorizontal: 24 }}>
                <Text style={{ fontWeight: 600, fontSize: 18, }}>Total: ${total}</Text>
                <Button text='Checkout' onPress={onCheckout} />
            </View> : null}
        </View>
    )
}

export default Cart

const styles = StyleSheet.create({
    listContainer: {
        padding: 10,
        gap: 5,
    }
})