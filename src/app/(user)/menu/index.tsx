import { ActivityIndicator, FlatList, StyleSheet, Text } from 'react-native'
import { View } from '@/components/Themed'
import ProductListItem from '@/components/ProductListItem'
import { useProductList } from '@/api/products'

export default function MenuScreen() {
  const { data: products, error, isLoading } = useProductList()

  if (isLoading) {
    return <ActivityIndicator />
  }

  if (error) {
    return <Text>Unable to Fetch data at the moment</Text>
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        renderItem={({ item }) => <ProductListItem product={item} />}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={{ gap: 10, padding: 10 }}
        columnWrapperStyle={{ gap: 10 }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'gainsboro',
  },
})
