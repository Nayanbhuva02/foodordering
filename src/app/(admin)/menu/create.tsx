import { Alert, Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Button from '@/components/Button'
import { defaultPizzaImage } from '@/constants/Images'
import Colors from '@/constants/Colors'
import * as ImagePicker from 'expo-image-picker';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import { useDeleteProduct, useInsertProduct, useProduct, useUpdateProduct } from '@/api/products'
import * as FileSystem from "expo-file-system"
import { randomUUID } from 'expo-crypto'
import { supabase } from '@/lib/supabase'
import { decode } from "base64-arraybuffer"
import RemoteImage from '@/components/RemoteImage'

const CreateProductScreen = () => {
    const [name, setName] = useState("")
    const [price, setPrice] = useState("")
    const [image, setImage] = useState<string | null>(null);
    const [errors, setErrors] = useState('');

    const router = useRouter();
    const { id: idString } = useLocalSearchParams();
    const isUpdating = !!idString;
    const id = parseFloat(typeof idString === "string" ? idString : idString?.[0])

    const { data: productDetail } = useProduct(id);

    const { mutate: insertProduct } = useInsertProduct();
    const { mutate: updateProduct } = useUpdateProduct();
    const { mutate: deleteProduct } = useDeleteProduct();

    useEffect(() => {
        if (productDetail && Object.keys(productDetail)?.length > 0) {
            setName(productDetail?.name);
            setPrice(productDetail?.price?.toString());
            setImage(productDetail?.image);
        }
    }, [productDetail])


    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const validateInput = () => {
        setErrors('');
        if (!name) {
            setErrors('Name is required');
            return false;
        }
        if (!price) {
            setErrors('Price is required');
            return false;
        }
        if (isNaN(parseFloat(price))) {
            setErrors('Price should be a number');
            return false;
        }
        return true;
    };

    const resetFields = () => {
        setName("");
        setPrice("");
    }

    const uploadImage = async () => {
        if (!image?.startsWith('file://')) {
            return;
        }

        const base64 = await FileSystem.readAsStringAsync(image, {
            encoding: 'base64',
        });
        const filePath = `${randomUUID()}.png`;
        const contentType = 'image/png';
        const { data } = await supabase.storage
            .from('product-images')
            .upload(filePath, decode(base64), { contentType });
        if (data) {
            return data.path;
        }
    };

    const onCreate = async () => {
        if (!validateInput()) {
            return
        }

        const imagePath = await uploadImage();

        insertProduct(
            { name, price: parseFloat(price), image: imagePath },
            {
                onSuccess: () => {
                    router.back();
                    resetFields();

                }
            })
    }

    const onUpdate = async () => {
        if (!validateInput()) {
            return
        }
        if (!id) return

        const imagePath = await uploadImage();

        updateProduct(
            { id, name, price: parseFloat(price), image: imagePath },
            {
                onSuccess: () => {
                    router.back();
                    resetFields();
                }
            })
    }

    const onDelete = () => {
        if (!id) return
        deleteProduct(id, {
            onSuccess: () => {
                router.replace("/(admin)")
                resetFields();
            }
        })
    }

    const onConfirmDelete = () => {
        Alert.alert("Confirm", "Are you sure you want to delete this product", [
            {
                text: 'Cancel'
            },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: onDelete
            }
        ])
    }

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: isUpdating ? "Update Product" : "Create Product" }} />

            {image && !image?.includes("file://") ?
                <RemoteImage
                    path={image}
                    fallback={defaultPizzaImage}
                    style={styles.image}
                /> :
                <Image source={{ uri: image || defaultPizzaImage }} style={styles.image} />
            }
            <Text style={styles.selectImageText} onPress={pickImage}>Select Image</Text>

            <Text style={styles.label}>Name</Text>
            <TextInput value={name} placeholder='Name' style={styles.input} onChangeText={setName} />

            <Text style={styles.label}>Price ($)</Text>
            <TextInput value={price} placeholder='Price' style={styles.input} keyboardType='numeric' onChangeText={setPrice} />

            <Text style={styles.error}>{errors}</Text>
            <Button text={isUpdating ? "Update" : 'Create'} onPress={isUpdating ? onUpdate : onCreate} />
            {isUpdating ?
                <Pressable style={styles.deleteButton} onPress={onConfirmDelete}>
                    <Text style={styles.deleteText}>Delete</Text>
                </Pressable>
                : null}
        </View>
    )
}

export default CreateProductScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 18
    },
    input: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 5,
        marginTop: 5,
        marginBottom: 20
    },
    label: {
        color: 'grey',
        fontSize: 16,
    },
    image: {
        width: "50%",
        aspectRatio: 1,
        alignSelf: 'center'
    },
    selectImageText: {
        color: Colors.light.tint,
        fontWeight: 'bold',
        alignSelf: 'center',
        marginVertical: 10,
    },
    error: {
        color: 'red',
        textAlign: 'center',
    },
    deleteButton: {
        borderWidth: 1,
        borderRadius: 100,
        borderColor: "red",
        padding: 15,
        alignItems: 'center',
        justifyContent: 'center'
    },
    deleteText: {
        color: 'red',
        fontSize: 16,
        fontWeight: '600',
    }
})