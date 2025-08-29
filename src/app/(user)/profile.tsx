import { StyleSheet, Text } from 'react-native'
import React from 'react'
import Button from '@/components/Button'
import { supabase } from '@/lib/supabase'
import { SafeAreaView } from 'react-native-safe-area-context'

const ProfileScreen = () => {
  return (
    <SafeAreaView style={{ flex: 1, padding: 10 }} edges={['top']}>
      <Text>Profile</Text>

      <Button text="Sign Out" onPress={async () => await supabase.auth.signOut()} />
    </SafeAreaView>
  )
}

export default ProfileScreen

const styles = StyleSheet.create({})
