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
import { ArrowLeft, Plus, MessageSquare, Gift as GiftIcon, Check, X } from 'lucide-react'

interface Person {
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
  families: {
    id: string
    name: string
    user_id: string
  }
}

interface Gift {
  id: string
  loved_one_id: string
  event_id: string | null
  name: string
  description: string | null
  price: number | null
  purchased: boolean
  purchase_date: string | null
  store: string | null
  url: string | null
  notes: string | null
  created_at: string
}

interface BudgetLimit {
  id: string
  loved_one_id: string
  event_id: string | null
  budget_limit: number
  events: {
    id: string
    name: string
    date: string
  } | null
}

interface Props {
  person: Person
  gifts: Gift[]
  budgetLimits: BudgetLimit[]
}

export default function PersonClient({ person, gifts, budgetLimits }: Props) {
  const [showNewGift, setShowNewGift] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [chatMessage, setChatMessage] = useState('')
  const [chatHistory, setChatHistory] = useState<
    Array<{ role: 'user' | 'assistant'; content: string }>
  >([])
  const [chatLoading, setChatLoading] = useState(false)
  const [giftForm, setGiftForm] = useState({
    name: '',
    description: '',
    price: '',
    store: '',
    url: '',
    notes: '',
  })
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleCreateGift = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.from('gifts').insert([
        {
          loved_one_id: person.id,
          name: giftForm.name,
          description: giftForm.description || null,
          price: giftForm.price ? parseFloat(giftForm.price) : null,
          store: giftForm.store || null,
          url: giftForm.url || null,
          notes: giftForm.notes || null,
          purchased: false,
        },
      ])

      if (error) throw error

      setGiftForm({
        name: '',
        description: '',
        price: '',
        store: '',
        url: '',
        notes: '',
      })
      setShowNewGift(false)
      router.refresh()
    } catch (error) {
      console.error('Error creating gift:', error)
    } finally {
      setLoading(false)
    }
  }

  const togglePurchased = async (giftId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('gifts')
        .update({
          purchased: !currentStatus,
          purchase_date: !currentStatus ? new Date().toISOString() : null,
        })
        .eq('id', giftId)

      if (error) throw error

      router.refresh()
    } catch (error) {
      console.error('Error updating gift:', error)
    }
  }

  const handleSendMessage = async () => {
    if (!chatMessage.trim()) return

    setChatLoading(true)
    const userMessage = chatMessage
    setChatMessage('')

    // Add user message to history
    setChatHistory((prev) => [...prev, { role: 'user', content: userMessage }])

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personId: person.id,
          message: userMessage,
        }),
      })

      const data = await response.json()

      if (data.response) {
        setChatHistory((prev) => [
          ...prev,
          { role: 'assistant', content: data.response },
        ])
      }
    } catch (error) {
      console.error('Error sending message:', error)
      setChatHistory((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Omlouváme se, došlo k chybě. Zkuste to prosím znovu.',
        },
      ])
    } finally {
      setChatLoading(false)
    }
  }

  const totalSpent = gifts
    .filter((g) => g.purchased && g.price)
    .reduce((sum, g) => sum + (g.price || 0), 0)

  const generalBudgetLimit = budgetLimits.find((bl) => !bl.event_id)

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <Link href={`/dashboard/family/${person.family_id}`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Zpět na rodinu
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{person.name}</CardTitle>
                <CardDescription>Detail osoby</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {person.birth_date && (
                  <p>
                    <strong>Narození:</strong>{' '}
                    {new Date(person.birth_date).toLocaleDateString('cs-CZ')}
                  </p>
                )}
                {person.interests && person.interests.length > 0 && (
                  <p>
                    <strong>Zájmy:</strong> {person.interests.join(', ')}
                  </p>
                )}
                {person.hobbies && person.hobbies.length > 0 && (
                  <p>
                    <strong>Koníčky:</strong> {person.hobbies.join(', ')}
                  </p>
                )}
                {person.clothing_size && (
                  <p>
                    <strong>Velikost oblečení:</strong> {person.clothing_size}
                  </p>
                )}
                {person.shoe_size && (
                  <p>
                    <strong>Velikost bot:</strong> {person.shoe_size}
                  </p>
                )}
                {person.favorite_colors && person.favorite_colors.length > 0 && (
                  <p>
                    <strong>Oblíbené barvy:</strong>{' '}
                    {person.favorite_colors.join(', ')}
                  </p>
                )}
                {person.notes && (
                  <p>
                    <strong>Poznámky:</strong> {person.notes}
                  </p>
                )}
                {generalBudgetLimit && (
                  <div className="pt-4 border-t">
                    <p>
                      <strong>Rozpočet:</strong> {generalBudgetLimit.budget_limit} Kč
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Utraceno: {totalSpent} Kč (
                      {Math.round(
                        (totalSpent / generalBudgetLimit.budget_limit) * 100
                      )}
                      %)
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Historie dárků</h2>
                <Button onClick={() => setShowNewGift(!showNewGift)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Přidat dárek
                </Button>
              </div>

              {showNewGift && (
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Přidat nový dárek</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleCreateGift} className="space-y-4">
                      <div>
                        <Label htmlFor="giftName">Název dárku *</Label>
                        <Input
                          id="giftName"
                          value={giftForm.name}
                          onChange={(e) =>
                            setGiftForm({ ...giftForm, name: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="description">Popis</Label>
                        <Textarea
                          id="description"
                          value={giftForm.description}
                          onChange={(e) =>
                            setGiftForm({
                              ...giftForm,
                              description: e.target.value,
                            })
                          }
                          rows={2}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="price">Cena (Kč)</Label>
                          <Input
                            id="price"
                            type="number"
                            step="0.01"
                            value={giftForm.price}
                            onChange={(e) =>
                              setGiftForm({ ...giftForm, price: e.target.value })
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="store">Obchod</Label>
                          <Input
                            id="store"
                            value={giftForm.store}
                            onChange={(e) =>
                              setGiftForm({ ...giftForm, store: e.target.value })
                            }
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="url">URL odkaz</Label>
                        <Input
                          id="url"
                          type="url"
                          value={giftForm.url}
                          onChange={(e) =>
                            setGiftForm({ ...giftForm, url: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="giftNotes">Poznámky</Label>
                        <Textarea
                          id="giftNotes"
                          value={giftForm.notes}
                          onChange={(e) =>
                            setGiftForm({ ...giftForm, notes: e.target.value })
                          }
                          rows={2}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button type="submit" disabled={loading}>
                          {loading ? 'Ukládání...' : 'Uložit'}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowNewGift(false)}
                        >
                          Zrušit
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}

              <div className="space-y-4">
                {gifts.length === 0 ? (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <GiftIcon className="h-16 w-16 text-muted-foreground mb-4" />
                      <p className="text-lg text-muted-foreground mb-2">
                        Zatím žádné dárky
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Přidejte první dárek nebo použijte AI chat
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  gifts.map((gift) => (
                    <Card key={gift.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <CardTitle className="flex items-center gap-2">
                              {gift.name}
                              {gift.purchased && (
                                <Check className="h-5 w-5 text-green-600" />
                              )}
                            </CardTitle>
                            {gift.description && (
                              <CardDescription>{gift.description}</CardDescription>
                            )}
                          </div>
                          <Button
                            variant={gift.purchased ? 'default' : 'outline'}
                            size="sm"
                            onClick={() =>
                              togglePurchased(gift.id, gift.purchased)
                            }
                          >
                            {gift.purchased ? (
                              <>
                                <Check className="h-4 w-4 mr-2" />
                                Koupeno
                              </>
                            ) : (
                              <>
                                <X className="h-4 w-4 mr-2" />
                                Nekoupeno
                              </>
                            )}
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          {gift.price && (
                            <p>
                              <strong>Cena:</strong> {gift.price} Kč
                            </p>
                          )}
                          {gift.store && (
                            <p>
                              <strong>Obchod:</strong> {gift.store}
                            </p>
                          )}
                          {gift.url && (
                            <p>
                              <strong>Odkaz:</strong>{' '}
                              <a
                                href={gift.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                              >
                                Zobrazit
                              </a>
                            </p>
                          )}
                          {gift.purchase_date && (
                            <p>
                              <strong>Datum nákupu:</strong>{' '}
                              {new Date(gift.purchase_date).toLocaleDateString(
                                'cs-CZ'
                              )}
                            </p>
                          )}
                          {gift.notes && (
                            <p>
                              <strong>Poznámky:</strong> {gift.notes}
                            </p>
                          )}
                          <p className="text-muted-foreground">
                            Přidáno:{' '}
                            {new Date(gift.created_at).toLocaleDateString('cs-CZ')}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </div>

          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  AI Chat - Nápady na dárky
                </CardTitle>
                <CardDescription>
                  Zeptejte se AI na návrhy dárků
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="h-[400px] overflow-y-auto space-y-3 border rounded-md p-3">
                    {chatHistory.length === 0 ? (
                      <div className="flex items-center justify-center h-full text-muted-foreground text-sm text-center">
                        Začněte konverzaci a získejte návrhy dárků pro{' '}
                        {person.name}
                      </div>
                    ) : (
                      chatHistory.map((msg, idx) => (
                        <div
                          key={idx}
                          className={`p-3 rounded-md ${
                            msg.role === 'user'
                              ? 'bg-primary text-primary-foreground ml-8'
                              : 'bg-muted mr-8'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">
                            {msg.content}
                          </p>
                        </div>
                      ))
                    )}
                    {chatLoading && (
                      <div className="bg-muted p-3 rounded-md mr-8">
                        <p className="text-sm text-muted-foreground">
                          AI přemýšlí...
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault()
                          handleSendMessage()
                        }
                      }}
                      placeholder="Napište zprávu..."
                      disabled={chatLoading}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={chatLoading || !chatMessage.trim()}
                    >
                      Odeslat
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
