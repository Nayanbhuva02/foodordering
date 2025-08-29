import { Alert } from "react-native";
import { supabase } from "./supabase";
import { initPaymentSheet, presentPaymentSheet } from "@stripe/stripe-react-native";


export const fetchPaymentSheetParams = async (amount: number) => {
    const { data, error } = await supabase.functions.invoke("payment-sheet", { body: { amount } })
    if (data) {
        return data
    }
    Alert.alert("Error fetching payment sheet params");
    console.log('error: ', error);
    return {}
}

export const initialiseStripePaymentSheet = async (amount: number) => {
    console.log('amount: ', amount);
    const { paymentIntent, publishableKey, customer, ephemeralKey } = await fetchPaymentSheetParams(amount);

    if (!paymentIntent || !publishableKey) return

    const result = await initPaymentSheet({
        merchantDisplayName: "JustForFood",
        paymentIntentClientSecret: paymentIntent,
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
        defaultBillingDetails: {
            name: "test foodie"
        }
    })
    console.log('result: ', result);
}

export const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();

    if (error) {
        Alert.alert(error?.message)
        return false
    }
    return true
}