'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Plus, ArrowLeft, User, Gift } from 'lucide-react'

interface Family {
  id: string
  name: string
  user_id: string
  created_at: string
  updated_at: string
}

interface LovedOne {
  id: string
  family_id: string
  name: string
  birth_date: string | null
  interests: string[] | null
  hobbies: string[] | null
  clothing_size: string | null
  shoe_size: string | null
  favorite_colors: string[] | null
  notes: string | null
  created_at: string
  updated_at: string
}

interface Props {
  family: Family
  lovedOnes: LovedOne[]
}

export default function FamilyClient({ family, lovedOnes }: Props) {
  const [showNewPerson, setShowNewPerson] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    birth_date: '',
    interests: '',
    hobbies: '',
    clothing_size: '',
    shoe_size: '',
    favorite_colors: '',
    notes: '',
  })
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleCreatePerson = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.from('loved_ones').insert([
        {
          family_id: family.id,
          name: formData.name,
          birth_date: formData.birth_date || null,
          interests: formData.interests
            ? formData.interests.split(',').map((i) => i.trim())
            : null,
          hobbies: formData.hobbies
            ? formData.hobbies.split(',').map((h) => h.trim())
            : null,
          clothing_size: formData.clothing_size || null,
          shoe_size: formData.shoe_size || null,
          favorite_colors: formData.favorite_colors
            ? formData.favorite_colors.split(',').map((c) => c.trim())
            : null,
          notes: formData.notes || null,
        },
      ])

      if (error) throw error

      setFormData({
        name: '',
        birth_date: '',
        interests: '',
        hobbies: '',
        clothing_size: '',
        shoe_size: '',
        favorite_colors: '',
        notes: '',
      })
      setShowNewPerson(false)
      router.refresh()
    } catch (error) {
      console.error('Error creating person:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Zpět na dashboard
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold">{family.name}</h1>
              <p className="text-muted-foreground">Správa blízkých</p>
            </div>
            <Button onClick={() => setShowNewPerson(!showNewPerson)}>
              <Plus className="h-4 w-4 mr-2" />
              Přidat osobu
            </Button>
          </div>

          {showNewPerson && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Přidat novou osobu</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreatePerson} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Jméno *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="birth_date">Datum narození</Label>
                      <Input
                        id="birth_date"
                        type="date"
                        value={formData.birth_date}
                        onChange={(e) =>
                          setFormData({ ...formData, birth_date: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="interests">Zájmy (oddělené čárkou)</Label>
                      <Input
                        id="interests"
                        value={formData.interests}
                        onChange={(e) =>
                          setFormData({ ...formData, interests: e.target.value })
                        }
                        placeholder="sport, hudba, cestování"
                      />
                    </div>
                    <div>
                      <Label htmlFor="hobbies">Koníčky (oddělené čárkou)</Label>
                      <Input
                        id="hobbies"
                        value={formData.hobbies}
                        onChange={(e) =>
                          setFormData({ ...formData, hobbies: e.target.value })
                        }
                        placeholder="čtení, fotbal, vaření"
                      />
                    </div>
                    <div>
                      <Label htmlFor="clothing_size">Velikost oblečení</Label>
                      <Input
                        id="clothing_size"
                        value={formData.clothing_size}
                        onChange={(e) =>
                          setFormData({ ...formData, clothing_size: e.target.value })
                        }
                        placeholder="M, L, XL..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="shoe_size">Velikost bot</Label>
                      <Input
                        id="shoe_size"
                        value={formData.shoe_size}
                        onChange={(e) =>
                          setFormData({ ...formData, shoe_size: e.target.value })
                        }
                        placeholder="42, 43..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="favorite_colors">
                        Oblíbené barvy (oddělené čárkou)
                      </Label>
                      <Input
                        id="favorite_colors"
                        value={formData.favorite_colors}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            favorite_colors: e.target.value,
                          })
                        }
                        placeholder="modrá, červená, zelená"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="notes">Poznámky</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData({ ...formData, notes: e.target.value })
                      }
                      placeholder="Další informace o osobě..."
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" disabled={loading}>
                      {loading ? 'Ukládání...' : 'Uložit'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowNewPerson(false)}
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
          {lovedOnes.length === 0 ? (
            <Card className="col-span-full">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <User className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-lg text-muted-foreground mb-2">
                  Zatím jste nepřidali žádnou osobu
                </p>
                <p className="text-sm text-muted-foreground">
                  Začněte přidáním prvního blízkého
                </p>
              </CardContent>
            </Card>
          ) : (
            lovedOnes.map((person) => (
              <Link
                key={person.id}
                href={`/dashboard/person/${person.id}`}
              >
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      {person.name}
                    </CardTitle>
                    {person.birth_date && (
                      <CardDescription>
                        Narození:{' '}
                        {new Date(person.birth_date).toLocaleDateString('cs-CZ')}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    {person.interests && person.interests.length > 0 && (
                      <p className="text-sm text-muted-foreground mb-2">
                        <strong>Zájmy:</strong> {person.interests.join(', ')}
                      </p>
                    )}
                    {person.hobbies && person.hobbies.length > 0 && (
                      <p className="text-sm text-muted-foreground">
                        <strong>Koníčky:</strong> {person.hobbies.join(', ')}
                      </p>
                    )}
                    <div className="mt-4 pt-4 border-t">
                      <Button variant="outline" size="sm" className="w-full">
                        <Gift className="h-4 w-4 mr-2" />
                        Zobrazit dárky
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </div>
      </main>
    </div>
  )
}
