'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Users, LogOut } from 'lucide-react'
import type { User } from '@supabase/supabase-js'

interface Family {
  id: string
  name: string
  user_id: string
  created_at: string
  updated_at: string
}

interface Props {
  families: Family[]
  user: User
}

export default function DashboardClient({ families, user }: Props) {
  const [showNewFamily, setShowNewFamily] = useState(false)
  const [newFamilyName, setNewFamilyName] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleCreateFamily = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase
        .from('families')
        .insert([{ name: newFamilyName, user_id: user.id }])

      if (error) throw error

      setNewFamilyName('')
      setShowNewFamily(false)
      router.refresh()
    } catch (error) {
      console.error('Error creating family:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Darky Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user.email}</span>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Odhlásit se
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-bold">Moje rodiny</h2>
            <Button onClick={() => setShowNewFamily(!showNewFamily)}>
              <Plus className="h-4 w-4 mr-2" />
              Nová rodina
            </Button>
          </div>

          {showNewFamily && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Vytvořit novou rodinu</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateFamily} className="space-y-4">
                  <div>
                    <Label htmlFor="familyName">Název rodiny</Label>
                    <Input
                      id="familyName"
                      value={newFamilyName}
                      onChange={(e) => setNewFamilyName(e.target.value)}
                      placeholder="např. Naše rodina"
                      required
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" disabled={loading}>
                      {loading ? 'Vytváření...' : 'Vytvořit'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowNewFamily(false)}
                    >
                      Zrušit
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {families.length === 0 ? (
            <Card className="col-span-full">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Users className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-lg text-muted-foreground mb-2">
                  Zatím nemáte žádnou rodinu
                </p>
                <p className="text-sm text-muted-foreground">
                  Začněte vytvořením své první rodiny
                </p>
              </CardContent>
            </Card>
          ) : (
            families.map((family) => (
              <Link key={family.id} href={`/dashboard/family/${family.id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      {family.name}
                    </CardTitle>
                    <CardDescription>
                      Vytvořeno {new Date(family.created_at).toLocaleDateString('cs-CZ')}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))
          )}
        </div>
      </main>
    </div>
  )
}
