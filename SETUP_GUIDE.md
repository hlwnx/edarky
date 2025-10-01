# Darky - Průvodce nastavením

Tento dokument vás provede nastavením aplikace Darky krok za krokem.

## 1. Nastavení Supabase

### Vytvoření projektu
1. Přejděte na [supabase.com](https://supabase.com)
2. Klikněte na "Start your project"
3. Přihlaste se nebo se zaregistrujte
4. Klikněte na "New Project"
5. Vyplňte:
   - Project Name: `darky` (nebo dle vašeho výběru)
   - Database Password: silné heslo (uložte si ho)
   - Region: vyberte nejbližší region
6. Klikněte na "Create new project"
7. Počkejte, až se projekt vytvoří (cca 2 minuty)

### Získání API klíčů
1. V Supabase dashboardu přejděte na "Project Settings" (ikona ozubeného kola)
2. Klikněte na "API"
3. Najděte:
   - **Project URL** - zkopírujte hodnotu
   - **anon public** key - zkopírujte hodnotu

### Spuštění SQL migrace
1. V Supabase dashboardu přejděte na "SQL Editor"
2. Klikněte na "New query"
3. Zkopírujte celý obsah souboru `supabase/migrations/001_initial_schema.sql`
4. Vložte do SQL editoru
5. Klikněte na "Run" (nebo stiskněte Ctrl+Enter)
6. Zkontrolujte, že se v "Table Editor" zobrazily nové tabulky:
   - families
   - loved_ones
   - gifts
   - events
   - person_budget_limits

### Ověření RLS (Row Level Security)
1. V "Table Editor" klikněte na každou tabulku
2. Klikněte na "Policies" tab
3. Ověřte, že jsou aktivní policies pro každou tabulku

## 2. Nastavení OpenAI API

### Vytvoření API klíče
1. Přejděte na [platform.openai.com](https://platform.openai.com)
2. Přihlaste se nebo se zaregistrujte
3. Přejděte na "API keys" (v navigaci vlevo)
4. Klikněte na "Create new secret key"
5. Pojmenujte klíč (např. "Darky App")
6. Zkopírujte API klíč (začíná na `sk-`)
7. **DŮLEŽITÉ**: Uložte si klíč bezpečně, po zavření dialogu ho již neuvidíte

### Nastavení kreditu
- Zkontrolujte, že máte dostatečný kredit na účtu
- Minimálně $5 pro testování
- Přejděte na "Billing" pro doplnění kreditu

## 3. Konfigurace aplikace

### Vytvoření .env.local souboru
1. V kořenovém adresáři projektu vytvořte soubor `.env.local`
2. Zkopírujte obsah z `.env.local.example`
3. Vyplňte skutečné hodnoty:

\`\`\`env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# OpenAI Configuration
OPENAI_API_KEY=sk-...
\`\`\`

### Ověření konfigurace
Ujistěte se, že:
- ✅ Supabase URL obsahuje vaši project-id
- ✅ Anon key začíná na `eyJ`
- ✅ OpenAI API key začíná na `sk-`
- ✅ Soubor je pojmenován přesně `.env.local` (bez `.txt` na konci)

## 4. Instalace závislostí

\`\`\`bash
npm install
\`\`\`

## 5. Spuštění aplikace

### Vývojový režim
\`\`\`bash
npm run dev
\`\`\`

Aplikace bude dostupná na: http://localhost:3000

### Produkční build
\`\`\`bash
npm run build
npm start
\`\`\`

## 6. První použití

### Registrace prvního uživatele
1. Otevřete http://localhost:3000
2. Klikněte na "Registrovat se"
3. Zadejte email a heslo (min. 6 znaků)
4. Klikněte na "Zaregistrovat se"
5. **DŮLEŽITÉ**: Zkontrolujte email - Supabase pošle potvrzovací odkaz
6. Klikněte na odkaz v emailu pro potvrzení

### První přihlášení
1. Po potvrzení emailu klikněte na "Přihlásit se"
2. Zadejte email a heslo
3. Budete přesměrováni na dashboard

### Vytvoření první rodiny
1. Na dashboardu klikněte na "Nová rodina"
2. Zadejte název (např. "Moje rodina")
3. Klikněte na "Vytvořit"

### Přidání první osoby
1. Klikněte na kartu rodiny
2. Klikněte na "Přidat osobu"
3. Vyplňte alespoň jméno
4. Volitelně vyplňte další informace (zájmy, koníčky, atd.)
5. Klikněte na "Uložit"

### Použití AI chatu
1. Klikněte na osobu
2. V pravém sloupci najdete AI Chat
3. Napište např.: "Jaký dárek bych mohl koupit?"
4. AI vám navrhne dárky na základě vyplněných informací

## Řešení problémů

### Build selhává s chybou "Cannot find module"
\`\`\`bash
rm -rf node_modules
rm package-lock.json
npm install
\`\`\`

### Supabase vrací 401 Unauthorized
- Zkontrolujte, že Supabase URL a klíče v `.env.local` jsou správné
- Ověřte, že soubor `.env.local` není v `.gitignore` a je v kořenovém adresáři
- Restartujte dev server (`Ctrl+C` a pak `npm run dev`)

### OpenAI API vrací chybu
- Zkontrolujte, že máte dostatečný kredit na OpenAI účtu
- Ověřte, že API klíč je správný
- Zkontrolujte, že klíč nebyl deaktivován

### Email potvrzení nepřichází
1. Zkontrolujte spam/junk složku
2. V Supabase dashboardu přejděte na "Authentication" → "Email Templates"
3. Ověřte, že je "Confirm signup" email povolen

### Stránka se nezobrazuje správně
- Vyčistěte cache prohlížeče (`Ctrl+Shift+R`)
- Zkuste jiný prohlížeč
- Zkontrolujte konzoli prohlížeče (F12) pro chyby

### Database chyba při vytváření rodiny/osoby
1. Přejděte do Supabase SQL Editoru
2. Ověřte, že migrace proběhla úspěšně
3. Zkontrolujte RLS policies v každé tabulce

## Další kroky

Po úspěšném nastavení můžete:
- 📝 Přidat více osob do rodiny
- 🎁 Začít přidávat dárky ručně
- 🤖 Experimentovat s AI chat pro návrhy
- 💰 Nastavit rozpočtové limity
- 📅 Vytvořit události (vyžaduje rozšíření)

## Produkční nasazení

Pro nasazení do produkce doporučujeme:
- [Vercel](https://vercel.com) - nejjednodušší pro Next.js
- [Netlify](https://netlify.com)
- [Railway](https://railway.app)

Nezapomeňte nastavit environment variables v produkčním prostředí!
