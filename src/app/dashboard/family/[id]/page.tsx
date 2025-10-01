import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import FamilyClient from './family-client'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function FamilyPage({ params }: PageProps) {
  const resolvedParams = await params
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: family } = await supabase
    .from('families')
    .select('*')
    .eq('id', resolvedParams.id)
    .eq('user_id', user.id)
    .single()

  if (!family) {
    redirect('/dashboard')
  }

  const { data: lovedOnes } = await supabase
    .from('loved_ones')
    .select('*')
    .eq('family_id', resolvedParams.id)
    .order('created_at', { ascending: false })

  return <FamilyClient family={family} lovedOnes={lovedOnes || []} />
}
