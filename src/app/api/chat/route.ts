import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { personId, message } = await request.json()

    // Get person details
    const { data: person } = await supabase
      .from('loved_ones')
      .select('*, families!inner(*)')
      .eq('id', personId)
      .single()

    if (!person || person.families.user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get gift history
    const { data: gifts } = await supabase
      .from('gifts')
      .select('*')
      .eq('loved_one_id', personId)

    // Build context for AI
    const personContext = `
Jméno: ${person.name}
${person.birth_date ? `Datum narození: ${person.birth_date}` : ''}
${person.interests?.length ? `Zájmy: ${person.interests.join(', ')}` : ''}
${person.hobbies?.length ? `Koníčky: ${person.hobbies.join(', ')}` : ''}
${person.clothing_size ? `Velikost oblečení: ${person.clothing_size}` : ''}
${person.shoe_size ? `Velikost bot: ${person.shoe_size}` : ''}
${person.favorite_colors?.length ? `Oblíbené barvy: ${person.favorite_colors.join(', ')}` : ''}
${person.notes ? `Poznámky: ${person.notes}` : ''}
`

    const giftHistory =
      gifts && gifts.length > 0
        ? `\n\nHistorie dárků:\n${gifts.map((g) => `- ${g.name}${g.description ? ': ' + g.description : ''}`).join('\n')}`
        : ''

    const systemPrompt = `Jsi pomocník pro návrhy dárků. Pomáháš uživatelům vybrat vhodný dárek pro jejich blízké.

Máš k dispozici tyto informace o osobě:
${personContext}${giftHistory}

DŮLEŽITÉ: Pokud navrhuješ dárek, který je podobný nějakému z historie, upozorni na to uživatele a navrhni alternativu.

Odpovídej v češtině, buď přátelský a nápomocný.`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message },
      ],
      temperature: 0.7,
      max_tokens: 500,
    })

    const response = completion.choices[0].message.content

    return NextResponse.json({ response })
  } catch (error) {
    console.error('Error in AI chat:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
