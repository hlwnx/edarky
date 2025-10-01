# Darky - Quick Reference

Rychlý přehled příkazů a funkcí aplikace.

## Příkazy

### Vývoj
\`\`\`bash
npm run dev          # Spustit vývojový server
npm run build        # Vytvořit produkční build
npm run start        # Spustit produkční server
npm run lint         # Spustit linter
\`\`\`

### Instalace
\`\`\`bash
npm install          # Nainstalovat všechny závislosti
npm update           # Aktualizovat závislosti
\`\`\`

## URL struktura

\`\`\`
/                           # Úvodní stránka
/auth/login                 # Přihlášení
/auth/register              # Registrace
/dashboard                  # Dashboard se seznamem rodin
/dashboard/family/[id]      # Detail rodiny se seznamem blízkých
/dashboard/person/[id]      # Detail osoby s dárky a AI chatem
/api/chat                   # API endpoint pro AI chat (POST)
\`\`\`

## Databázové tabulky

### families
- `id` - UUID, primary key
- `name` - název rodiny
- `user_id` - reference na auth.users
- `created_at`, `updated_at` - timestamp

### loved_ones
- `id` - UUID, primary key
- `family_id` - reference na families
- `name` - jméno osoby
- `birth_date` - datum narození
- `interests[]` - pole zájmů
- `hobbies[]` - pole koníčků
- `clothing_size` - velikost oblečení
- `shoe_size` - velikost bot
- `favorite_colors[]` - oblíbené barvy
- `notes` - poznámky

### gifts
- `id` - UUID, primary key
- `loved_one_id` - reference na loved_ones
- `event_id` - reference na events (nullable)
- `name` - název dárku
- `description` - popis
- `price` - cena
- `purchased` - boolean (koupeno/nekoupeno)
- `purchase_date` - datum nákupu
- `store` - název obchodu
- `url` - odkaz na produkt
- `notes` - poznámky

### events
- `id` - UUID, primary key
- `family_id` - reference na families
- `name` - název události (Vánoce, narozeniny)
- `date` - datum události
- `budget_limit` - rozpočtový limit pro celou událost

### person_budget_limits
- `id` - UUID, primary key
- `loved_one_id` - reference na loved_ones
- `event_id` - reference na events (nullable)
- `budget_limit` - rozpočtový limit

## Environment Variables

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL         # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY    # Supabase anon key
OPENAI_API_KEY                   # OpenAI API key
\`\`\`

## Často používané komponenty

### UI Komponenty (shadcn/ui)
\`\`\`tsx
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
\`\`\`

### Supabase Client
\`\`\`tsx
// Client component
import { createClient } from '@/lib/supabase/client'
const supabase = createClient()

// Server component
import { createClient } from '@/lib/supabase/server'
const supabase = await createClient()
\`\`\`

### Typické operace

#### Získání rodin uživatele
\`\`\`tsx
const { data: families } = await supabase
  .from('families')
  .select('*')
  .eq('user_id', user.id)
\`\`\`

#### Přidání nové osoby
\`\`\`tsx
const { data, error } = await supabase
  .from('loved_ones')
  .insert([{
    family_id: familyId,
    name: 'Jan Novák',
    interests: ['sport', 'hudba']
  }])
\`\`\`

#### Získání dárků osoby
\`\`\`tsx
const { data: gifts } = await supabase
  .from('gifts')
  .select('*')
  .eq('loved_one_id', personId)
  .order('created_at', { ascending: false })
\`\`\`

#### AI Chat request
\`\`\`tsx
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    personId: personId,
    message: 'Jaký dárek bych mohl koupit?'
  })
})
const data = await response.json()
\`\`\`

## Užitečné SQL dotazy

### Celkové náklady na dárky pro osobu
\`\`\`sql
SELECT 
  loved_ones.name,
  SUM(gifts.price) as total_spent
FROM loved_ones
LEFT JOIN gifts ON gifts.loved_one_id = loved_ones.id
WHERE gifts.purchased = true
GROUP BY loved_ones.id, loved_ones.name;
\`\`\`

### Nejoblíbenější typy dárků
\`\`\`sql
SELECT 
  name,
  COUNT(*) as count
FROM gifts
WHERE purchased = true
GROUP BY name
ORDER BY count DESC
LIMIT 10;
\`\`\`

### Osoby s překročeným rozpočtem
\`\`\`sql
SELECT 
  lo.name,
  pbl.budget_limit,
  SUM(g.price) as spent,
  SUM(g.price) - pbl.budget_limit as over_budget
FROM loved_ones lo
JOIN person_budget_limits pbl ON pbl.loved_one_id = lo.id
JOIN gifts g ON g.loved_one_id = lo.id
WHERE g.purchased = true
GROUP BY lo.id, lo.name, pbl.budget_limit
HAVING SUM(g.price) > pbl.budget_limit;
\`\`\`

## Ikony (lucide-react)

Použité ikony v aplikaci:
\`\`\`tsx
import { 
  Plus,           // Přidat
  Users,          // Rodiny/Skupiny
  User,           // Osoba
  Gift,           // Dárek
  MessageSquare,  // Chat
  ArrowLeft,      // Zpět
  LogOut,         // Odhlásit
  Check,          // Koupeno
  X,              // Nekoupeno
} from 'lucide-react'
\`\`\`

## Tipy a triky

### Rychlé testování
1. Použijte `npm run dev` pro hot reload během vývoje
2. Otevřete více oken prohlížeče pro testování různých uživatelů
3. Použijte Supabase Table Editor pro přímé úpravy dat

### Debugování
1. Zkontrolujte konzoli prohlížeče (F12)
2. Zkontrolujte Network tab pro API requesty
3. Použijte Supabase Logs pro chyby na backendu

### Performance
1. Indexy jsou vytvořeny automaticky migrací
2. RLS policies jsou optimalizované
3. Next.js automaticky cachuje statické stránky

### Bezpečnost
1. Nikdy necommitujte `.env.local`
2. Rotujte API klíče pravidelně
3. Monitorujte Supabase usage dashboard

## Rozšíření

### Přidání nové tabulky
1. Vytvořte SQL migračn soubor v `supabase/migrations/`
2. Přidejte RLS policies
3. Aktualizujte TypeScript typy v `src/types/database.types.ts`

### Přidání nové stránky
1. Vytvořte složku v `src/app/`
2. Přidejte `page.tsx` (server component)
3. Volitelně přidejte `*-client.tsx` (client component)

### Přidání nového API endpointu
1. Vytvořte složku v `src/app/api/`
2. Přidejte `route.ts` s GET/POST/PUT/DELETE funkcemi
3. Přidejte autentizaci pomocí Supabase

## Podpora

- 📚 [Next.js Dokumentace](https://nextjs.org/docs)
- 📚 [Supabase Dokumentace](https://supabase.com/docs)
- 📚 [shadcn/ui Dokumentace](https://ui.shadcn.com)
- 📚 [OpenAI API Dokumentace](https://platform.openai.com/docs)
