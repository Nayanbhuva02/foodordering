import { supabase } from '@/lib/supabase'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'

export const useInsertOrderSubscription = () => {
  const queryClient = useQueryClient()

  useEffect(() => {
    const channels = supabase
      .channel('custom-insert-channel')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, (payload) => {
        console.log('payload: ', payload)
        queryClient.invalidateQueries({ queryKey: ['orders'] })
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Subscribed to the channel')
        }
      })
    return () => {
      channels.unsubscribe()
    }
  }, [])
}

export const useUpdateOrderSubscription = (id: number) => {
  const queryClient = useQueryClient()
  useEffect(() => {
    const channels = supabase
      .channel('custom-filter-channel')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'orders', filter: `id=eq.${id}` },
        () => {
          queryClient.invalidateQueries({ queryKey: ['orders', id] })
        },
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Subscribed to the channel')
        }
      })

    return () => {
      channels.unsubscribe()
    }
  }, [])
}
