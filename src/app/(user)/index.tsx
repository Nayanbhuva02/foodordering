import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Redirect } from 'expo-router'

export default function TabIndex() {
    return <Redirect href={"/(user)/menu/"} />
}

const styles = StyleSheet.create({})