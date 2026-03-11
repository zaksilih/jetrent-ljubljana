# JetRent Ljubljana

Spletna stran za najem jet skija Sea-Doo Spark v Ljubljani, Slovenija.

## O projektu

Moderna, odzivna spletna stran za najem jet skija, namenjena slovenskim strankam, ki odidejo na počitnice na Hrvaško. Stran je zgrajena z Next.js 14, TypeScript in Tailwind CSS.

### Funkcionalnosti

- 🏠 Domača stran s pregledom ponudbe
- 💰 Pregleden cenik z različnimi paketi
- 📋 Postopek najema korak za korakom
- ❓ Pogosta vprašanja (FAQ)
- 📝 Obrazec za povpraševanje
- 📱 Popolnoma odziven dizajn
- 🔍 SEO optimizacija

## Tehnologije

- [Next.js 14](https://nextjs.org/) - React framework z App Router
- [TypeScript](https://www.typescriptlang.org/) - Tipiziran JavaScript
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [shadcn/ui](https://ui.shadcn.com/) - UI komponente
- [Radix UI](https://www.radix-ui.com/) - Dostopne komponente
- [Lucide Icons](https://lucide.dev/) - Ikone

## Začetek

### Predpogoji

- Node.js 18.17 ali novejši
- npm (vključen z Node.js)

### Namestitev

```bash
# Klonirajte repozitorij (ali razpakirajte datoteke)
cd jetrent-ljubljana

# Namestite odvisnosti
npm install
```

### Razvoj

```bash
# Zaženite razvojni strežnik
npm run dev
```

Odprite [http://localhost:3000](http://localhost:3000) v brskalniku.

### Produkcija

```bash
# Zgradite aplikacijo
npm run build

# Zaženite produkcijski strežnik
npm start
```

## Objava na Vercel

### Avtomatska objava

1. Potisnite kodo na GitHub/GitLab/Bitbucket
2. Uvozite projekt v [Vercel](https://vercel.com/new)
3. Vercel bo avtomatsko zaznal Next.js in nastavil projekt
4. Kliknite "Deploy"

### Ročna objava

```bash
# Namestite Vercel CLI
npm i -g vercel

# Objavite
vercel
```

## Struktura projekta

```
src/
├── app/                    # Next.js App Router strani
│   ├── page.tsx           # Domača stran
│   ├── cenik/             # Cenik
│   ├── kako-deluje/       # Kako deluje
│   ├── vprasanja/         # Pogosta vprašanja
│   ├── kontakt/           # Kontakt in povpraševanje
│   ├── pogoji/            # Pogoji uporabe (placeholder)
│   ├── zasebnost/         # Zasebnost (placeholder)
│   └── pogodba/           # Najemna pogodba (placeholder)
├── components/
│   ├── ui/                # Osnovne UI komponente
│   ├── layout/            # Header, Footer
│   └── home/              # Komponente domače strani
├── data/                  # Vsebina in konfiguracija
│   ├── business.ts        # Poslovni podatki
│   ├── pricing.ts         # Cene
│   ├── faq.ts             # Pogosta vprašanja
│   ├── content.ts         # Vsebina strani
│   └── navigation.ts      # Navigacija
└── lib/                   # Pomožne funkcije
    └── utils.ts
```

## Prilagoditev

### Poslovni podatki

Uredite `src/data/business.ts` za:
- Ime podjetja
- Kontaktne podatke
- Socialna omrežja
- SEO nastavitve

### Cene

Uredite `src/data/pricing.ts` za:
- Cene paketov
- Opise sezon
- Opombe o cenah

### Vsebina

Uredite `src/data/content.ts` za:
- Besedila na domači strani
- Korake postopka najema
- Sezname zahtev

### Pogosta vprašanja

Uredite `src/data/faq.ts` za dodajanje/urejanje FAQ vnosov.

### Slike

Zamenjajte placeholder slike:
1. Dodajte slike v `public/images/`
2. Posodobite reference v komponentah (npr. `Hero.tsx`)

## Integracija Supabase

Projekt je pripravljen za integracijo Supabase. Ko boste pripravljeni:

### 1. Ustvarite Supabase projekt

Obiščite [supabase.com](https://supabase.com) in ustvarite nov projekt.

### 2. Ustvarite tabelo za povpraševanja

```sql
CREATE TABLE inquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  date_from DATE NOT NULL,
  date_to DATE NOT NULL,
  destination TEXT,
  has_tow_hitch BOOLEAN NOT NULL,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'new'
);
```

### 3. Nastavite okoljske spremenljivke

Kopirajte `.env.example` v `.env.local` in izpolnite:

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 4. Namestite Supabase

```bash
npm install @supabase/supabase-js
```

### 5. Aktivirajte kodo

Odkomuntirajte Supabase kodo v `src/app/kontakt/actions.ts`.

## Prihodnje razširitve

Projekt je zasnovan za enostavno razširitev:

- [ ] Supabase integracija za shranjevanje povpraševanj
- [ ] Koledar razpoložljivosti
- [ ] Admin nadzorna plošča
- [ ] Galerija slik
- [ ] Večjezičnost (SI/EN)
- [ ] Online plačilo/polog

## Opombe

### Pred javno objavo

1. **Zamenjajte placeholder podatke:**
   - Ime podjetja v `src/data/business.ts`
   - Kontaktne podatke
   - E-poštni naslov in telefon
   - Socialna omrežja

2. **Dodajte prave slike:**
   - Hero slika jet skija
   - Morebitne dodatne slike

3. **Pravni dokumenti:**
   - Pogoji uporabe
   - Politika zasebnosti (GDPR)
   - Najemna pogodba

4. **SEO:**
   - Posodobite meta opise
   - Dodajte favicon
   - Nastavite Google Analytics (opcijsko)

### Vzdrževanje

- Posodobite cene v `pricing.ts` pred vsako sezono
- Redno preverjajte in odgovarjajte na povpraševanja
- Posodabljajte FAQ glede na pogosta vprašanja

## Licenca

Zasebni projekt. Vse pravice pridržane.

---

Razvito z ❤️ za slovensko obalo
