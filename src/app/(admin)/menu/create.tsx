import { Alert, Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import Button from '@/components/Button'
import { defaultPizzaImage } from '@/constants/Images'
import Colors from '@/constants/Colors'
import * as ImagePicker from 'expo-image-picker';
import { Stack, useLocalSearchParams } from 'expo-router'

const CreateProductScreen = () => {
    const [name, setName] = useState("")
    const [price, setPrice] = useState("")
    const [image, setImage] = useState<string | null>(null);
    const [errors, setErrors] = useState('');

    const { id } = useLocalSearchParams();
    const isUpdating = !!id;

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        console.log(result);

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

    const onCreate = () => {
        if (!validateInput()) {
            return
        }
        resetFields();
    }

    const onUpdate = () => {
        if (!validateInput()) {
            return
        }
        resetFields();
    }

    const onDelete = () => {
        //will leads to API call
    }

    const onConfirmDelete = () => {
        // will lead to an modal to  confirmation

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

            <Image source={{ uri: image || defaultPizzaImage }} style={styles.image} />
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