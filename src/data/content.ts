// Page content in Slovenian - centralized for easy editing
export const homeContent = {
  hero: {
    title: 'Jet ski za vaš dopust na Hrvaškem',
    subtitle: 'Najemite Sea-Doo Spark s prikolico v Ljubljani in uživajte v popolni svobodi na morju. Idealno za tedenski ali dvotedenski najem.',
    primaryCTA: 'Pošlji povpraševanje',
    secondaryCTA: 'Poglej cenik',
    badge: 'Rezerviraj pravočasno za poletno sezono',
  },
  
  benefits: {
    title: 'Zakaj najem pri nas?',
    subtitle: 'Enostavno, ugodno in brez skrbi',
    items: [
      {
        title: 'Prevzem v Ljubljani',
        description: 'Brez dolgih poti – jet ski prevzamete v okolici Ljubljane in se takoj odpravite na pot.',
        icon: 'MapPin',
      },
      {
        title: 'Prikolica vključena',
        description: 'Vse kar potrebujete je vozilo s kljuko. Prikolico dobite skupaj z jet skijem.',
        icon: 'Truck',
      },
      {
        title: 'Idealno za Hrvaško',
        description: 'Večina naših strank jet ski uporablja na hrvaškem morju. Dokumentacija je urejena.',
        icon: 'Waves',
      },
      {
        title: 'Ugodnejše za tedenski najem',
        description: 'Daljši najem pomeni nižjo dnevno ceno. Že od 60 €/dan v nizki sezoni.',
        icon: 'Percent',
      },
    ],
  },
  
  howItWorks: {
    title: 'Kako poteka najem?',
    subtitle: 'V treh preprostih korakih do nepozabnih trenutkov',
    steps: [
      {
        step: 1,
        title: 'Pošljite povpraševanje',
        description: 'Izpolnite obrazec ali nas pokličite. Sporočite želeni termin in destinacijo.',
      },
      {
        step: 2,
        title: 'Potrditev in dogovor',
        description: 'Potrdimo razpoložljivost, se dogovorimo za prevzem in vam pošljemo vse potrebne informacije.',
      },
      {
        step: 3,
        title: 'Prevzem in uživanje',
        description: 'Na dogovorjeni lokaciji prevzamete jet ski s prikolico, prejmete navodila in ste pripravljeni za akcijo!',
      },
    ],
  },
  
  pricingPreview: {
    title: 'Naše cene',
    subtitle: 'Pregledne cene brez skritih stroškov',
    ctaText: 'Ogled celotnega cenika',
  },
  
  faqPreview: {
    title: 'Pogosta vprašanja',
    subtitle: 'Odgovori na najpogostejša vprašanja',
    ctaText: 'Vsa vprašanja',
  },
  
  contactCTA: {
    title: 'Pripravljeni na avanturo?',
    subtitle: 'Pošljite povpraševanje in rezervirajte svoj termin še danes.',
    ctaText: 'Pošlji povpraševanje',
  },
}

export const howItWorksContent = {
  hero: {
    title: 'Kako deluje najem?',
    subtitle: 'Preprost postopek od povpraševanja do vračila',
  },
  
  steps: [
    {
      step: 1,
      title: 'Oddaja povpraševanja',
      description: 'Izpolnite obrazec na naši spletni strani ali nas kontaktirajte po telefonu. Navedite želeni datum najema, trajanje in destinacijo uporabe. Odgovorili vam bomo v najkrajšem možnem času.',
      icon: 'Send',
    },
    {
      step: 2,
      title: 'Potrditev termina',
      description: 'Preverimo razpoložljivost jet skija za vaš termin. Ob potrditvi vam pošljemo vse podrobnosti o najemu, ceno ter navodila za prevzem.',
      icon: 'CalendarCheck',
    },
    {
      step: 3,
      title: 'Prevzem v Ljubljani',
      description: 'Na dogovorjeni dan in uri se srečamo v okolici Ljubljane. Skupaj preverimo stanje jet skija, podpišemo pogodbo in plačate kavcijo. Prejmete tudi ključe in vso potrebno dokumentacijo.',
      icon: 'MapPin',
    },
    {
      step: 4,
      title: 'Navodila za uporabo',
      description: 'Pred prevzemom vam podrobno razložimo delovanje jet skija, varnostna pravila in nasvete za uporabo. Če ste začetnik, si vzemite čas za vprašanja.',
      icon: 'BookOpen',
    },
    {
      step: 5,
      title: 'Vračilo po koncu najema',
      description: 'Ob koncu najemnega obdobja jet ski vrnete na dogovorjeno lokacijo. Skupaj preverimo stanje, in če je vse v redu, vam vrnemo kavcijo. Tako preprosto!',
      icon: 'CheckCircle',
    },
  ],
  
  checklist: {
    title: 'Kaj potrebujete?',
    subtitle: 'Pred prevzemom preverite, da imate vse potrebno',
    items: [
      {
        title: 'Vozilo s kljuko',
        description: 'Vaše vozilo mora imeti tovorno kljuko z ustrezno vlečno kapaciteto (prikolica tehta ~400 kg).',
        required: true,
      },
      {
        title: 'Dokumenti za vleko',
        description: 'Preverite, ali vaše vozniško dovoljenje omogoča vleko prikolice te teže. Po potrebi pridobite dovoljenje za tretjo tablico.',
        required: true,
      },
      {
        title: 'Osebni dokument',
        description: 'Za podpis pogodbe potrebujete veljaven osebni dokument.',
        required: true,
      },
      {
        title: 'Kavcija',
        description: 'Ob prevzemu je potrebno plačilo kavcije v višini 500 € (gotovina ali po dogovoru).',
        required: true,
      },
      {
        title: 'Osnovno razumevanje varne uporabe',
        description: 'Ob prevzemu vam razložimo delovanje, vendar je dobrodošlo, da se predhodno seznanite z osnovno plovbo.',
        required: false,
      },
    ],
  },
  
  warnings: {
    title: 'Pomembna opozorila',
    items: [
      {
        title: 'Jet ski je zmogljivo plovilo',
        description: 'Sea-Doo Spark je sicer primeren za začetnike, vendar je kljub temu zmogljiv in zahteva odgovorno uporabo. Vedno upoštevajte varnostna pravila.',
        type: 'warning',
      },
      {
        title: 'Ne zaganjajte v plitki vodi',
        description: 'Jet ski nikoli ne zaganjajte v plitki vodi ali blizu obale. Motor črpa vodo in lahko posesa pesek ali kamenje, kar povzroči resne poškodbe.',
        type: 'error',
      },
      {
        title: 'Odgovornost najemnika',
        description: 'Stranka je odgovorna za skrbno ravnanje z jet skijem in prikolico. Poškodbe, nastale zaradi malomarnosti, se pokrijejo iz kavcije oziroma jih plača najemnik.',
        type: 'info',
      },
    ],
  },
}

export const contactContent = {
  hero: {
    title: 'Pošljite povpraševanje',
    subtitle: 'Izpolnite obrazec in odgovorili vam bomo v najkrajšem možnem času.',
  },
  
  form: {
    submitButton: 'Pošlji povpraševanje',
    submitting: 'Pošiljam...',
    successTitle: 'Povpraševanje poslano!',
    successMessage: 'Hvala za vaše povpraševanje. Odgovorili vam bomo v najkrajšem možnem času.',
    errorTitle: 'Napaka pri pošiljanju',
    errorMessage: 'Prišlo je do napake. Prosimo, poskusite ponovno ali nas kontaktirajte po telefonu.',
  },
  
  contactInfo: {
    title: 'Kontaktni podatki',
    subtitle: 'Lahko nas tudi pokličete ali pišete direktno.',
  },
}

export const pricingContent = {
  hero: {
    title: 'Cenik najema',
    subtitle: 'Pregledne cene prilagojene različnim potrebam',
    badge: 'Najbolj primerno za tedenski najem',
  },
}
