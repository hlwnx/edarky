# Darky - Gift Management Application

Moderní aplikace pro správu dárků pro vaše blízké s integrovanou AI, která vám pomůže s výběrem správného dárku.

## Funkce

- 🔐 **Autentizace** - Registrace a přihlášení pomocí Supabase Auth
- 👨‍👩‍👧‍👦 **Správa rodin** - Vytvářejte a spravujte více rodin
- 💝 **Správa blízkých** - Přidejte své blízké s detailními informacemi (zájmy, koníčky, velikosti oblečení, atd.)
- 🎁 **Historie dárků** - Sledujte všechny dárky, které jste dali svým blízkým
- 🤖 **AI chat** - Získejte návrhy dárků pomocí AI, které kontroluje historii a varuje před duplicity
- ✅ **Sledování nákupů** - Označte dárky jako koupené/nekoupené
- 💰 **Finanční limity** - Nastavte rozpočty pro jednotlivé osoby nebo události

## Technologie

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL)
- **AI**: OpenAI GPT-4
- **Autentizace**: Supabase Auth

## Požadavky

- Node.js 18 nebo vyšší
- npm
- Účet na Supabase
- OpenAI API klíč

## Instalace

1. Naklonujte repozitář nebo stáhněte projekt

2. Nainstalujte závislosti:
\`\`\`bash
npm install
\`\`\`

3. Vytvořte `.env.local` soubor v kořenovém adresáři projektu:
\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
OPENAI_API_KEY=your-openai-api-key
\`\`\`

4. Nastavte Supabase databázi:
   - Přihlaste se do Supabase
   - Vytvořte nový projekt
   - Spusťte SQL migrace ze souboru `supabase/migrations/001_initial_schema.sql`

## Spuštění

### Vývojové prostředí

\`\`\`bash
npm run dev
\`\`\`

Aplikace bude dostupná na [http://localhost:3000](http://localhost:3000)

### Produkční build

\`\`\`bash
npm run build
npm start
\`\`\`

## Struktura projektu

\`\`\`
darky/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── chat/          # API endpoint pro AI chat
│   │   ├── auth/              # Autentizační stránky
│   │   ├── dashboard/         # Dashboard a správa rodin
│   │   │   ├── family/        # Detail rodiny
│   │   │   └── person/        # Detail osoby s dárky
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx           # Úvodní stránka
│   ├── components/
│   │   └── ui/                # shadcn/ui komponenty
│   ├── lib/
│   │   ├── supabase/          # Supabase konfigurace
│   │   └── utils.ts
│   ├── types/
│   │   └── database.types.ts  # TypeScript typy pro databázi
│   └── middleware.ts
├── supabase/
│   └── migrations/            # SQL migrace
├── .env.local.example
├── package.json
└── README.md
\`\`\`

## Použití

1. **Registrace/Přihlášení**: Začněte vytvořením účtu nebo přihlášením
2. **Vytvoření rodiny**: Vytvořte svou první rodinu
3. **Přidání blízkých**: Přidejte osoby do rodiny s jejich detaily
4. **AI asistent**: Použijte AI chat k získání nápadů na dárky
5. **Správa dárků**: Přidávejte dárky a sledujte jejich nákup
6. **Rozpočty**: Nastavte finanční limity

## Databázové schéma

Aplikace používá následující tabulky:
- `families` - Rodiny uživatelů
- `loved_ones` - Blízcí v rodinách
- `gifts` - Historie dárků
- `events` - Události (Vánoce, narozeniny, atd.)
- `person_budget_limits` - Finanční limity

Všechny tabulky mají Row Level Security (RLS) pro zabezpečení dat.

## Bezpečnost

- Všechny data jsou chráněna Row Level Security v Supabase
- Autentizace pomocí Supabase Auth
- API endpointy vyžadují autentizaci
- Middleware pro refresh session tokenů

## Známé problémy a TODO

- [ ] Přidání správy událostí (Vánoce, narozeniny)
- [ ] Export historie dárků
- [ ] Sdílení rodin s dalšími uživateli
- [ ] Notifikace před událostmi
- [ ] Wishlisty pro blízké
- [ ] Mobilní aplikace

## Podpora

Pokud narazíte na problémy, vytvořte issue v repositáři.

## Licence

MIT
