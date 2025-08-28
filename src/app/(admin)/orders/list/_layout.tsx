
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { withLayoutContext } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const Tab = withLayoutContext(createMaterialTopTabNavigator().Navigator);

export default function OrderListNavigator() {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }} edges={['top']}>
            <Tab />
        </SafeAreaView>
    );
}