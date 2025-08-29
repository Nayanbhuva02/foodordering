import { supabase } from '@/lib/supabase'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useProductList = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase.from('products').select('*')
      if (error) {
        throw new Error(error.message)
      }
      return data
    },
  })
}

export const useProduct = (id: number) => {
  return useQuery({
    queryKey: ['products', id],
    queryFn: async () => {
      const { data, error } = await supabase.from('products').select('*').eq('id', id).single()
      if (error) {
        throw new Error(error.message)
      }
      return data
    },
  })
}

export const useInsertProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: any) => {
      const { data: newProduct, error } = await supabase
        .from('products')
        .insert({
          name: data.name,
          price: data?.price,
          image: data?.image,
        })
        .single()

      if (error) {
        throw new Error(error?.message)
      }
      return newProduct
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}

export const useUpdateProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: any) => {
      const { data: updatedProduct, error } = await supabase
        .from('products')
        .update({
          name: data.name,
          price: data?.price,
          image: data?.image,
        })
        .eq('id', data?.id)
        .select()
        .single()

      if (error) {
        throw new Error(error?.message)
      }
      return updatedProduct
    },
    onSuccess: async (_, data) => {
      await queryClient.invalidateQueries({ queryKey: ['products'] })
      await queryClient.invalidateQueries({ queryKey: ['products', data?.id] })
    },
  })
}

export const useDeleteProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      await supabase.from('products').delete()?.eq('id', id)
    },
    onSuccess: async (_, data) => {
      await queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}
