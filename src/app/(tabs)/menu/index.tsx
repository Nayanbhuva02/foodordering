import { FlatList, StyleSheet } from 'react-native';
import { View } from '@/components/Themed';
import { products } from '@/assets/data/products';
import Colors from '@/constants/Colors';
import ProductListItem from '@/components/ProductListItem';



export default function MenuScreen() {
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'grey'
  },
  image: {
    width: '100%',
    aspectRatio: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginTop: 10,
  },
  price: {
    fontSize: 16,
    color: Colors.light.tint
  },
});
