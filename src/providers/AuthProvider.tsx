import { supabase } from '@/lib/supabase'
import { Session } from '@supabase/supabase-js'
import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react'
import { Tables } from 'types'

type Profile = Tables<'profiles'>

type AuthType = {
  session: Session | null
  profile: Profile | null
  loading: boolean
  isAdmin: boolean
}

const AuthContext = createContext<AuthType>({
  session: null,
  loading: true,
  profile: null,
  isAdmin: false,
})

export default function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession()
      setSession(session)

      if (session) {
        //fetch profile
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
        setProfile(data || null)
      }
      setLoading(false)
    }

    fetchSession()

    supabase.auth.onAuthStateChange((event, session) => {
      setSession(session)
    })
  }, [])

  return (
    <AuthContext.Provider
      value={{ session, loading, profile, isAdmin: profile?.group === 'ADMIN' }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
