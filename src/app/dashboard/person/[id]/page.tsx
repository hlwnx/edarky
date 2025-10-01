import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import PersonClient from './person-client'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function PersonPage({ params }: PageProps) {
  const resolvedParams = await params
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: person } = await supabase
    .from('loved_ones')
    .select('*, families!inner(*)')
    .eq('id', resolvedParams.id)
    .single()

  if (!person || person.families.user_id !== user.id) {
    redirect('/dashboard')
  }

  const { data: gifts } = await supabase
    .from('gifts')
    .select('*')
    .eq('loved_one_id', resolvedParams.id)
    .order('created_at', { ascending: false })

  const { data: budgetLimits } = await supabase
    .from('person_budget_limits')
    .select('*, events(*)')
    .eq('loved_one_id', resolvedParams.id)

  return (
    <PersonClient
      person={person}
      gifts={gifts || []}
      budgetLimits={budgetLimits || []}
    />
  )
}
