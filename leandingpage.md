# 🌐 Guida: Implementazione di Google Translate in Landing Page Personalizzata

Questa guida contiene le istruzioni passo-passo e i prompt pronti all'uso per richiedere ad **Antigravity** (o un'altra AI) di implementare il sistema di traduzione multilingua basato su Google Translate (senza widget invasivi) all'interno del tuo portfolio personale.

---

## 🛠️ Cosa fa questo sistema?
1. **Traduzione Istantanea**: Traduce l'intera pagina in oltre 100 lingue tramite lo script ufficiale client-side di Google Translate.
2. **Design Personalizzato**: Nasconde l'interfaccia standard e ingombrante di Google e la sostituisce con un dropdown elegante e moderno in stile *Glassmorphism*.
3. **Persistenza della Lingua**: Salva la lingua scelta dall'utente nei cookie (`googtrans`) in modo che il sito rimanga tradotto anche al cambio pagina o a visite successive.
4. **Bypass dei Jump di Layout**: Previene lo spostamento verso il basso del sito (di solito causato dal banner di Google) tramite CSS mirati.

---

## 📋 Istruzioni Passo-Passo per l'AI

Puoi copiare e incollare i seguenti prompt in sequenza all'AI per farle implementare l'intero sistema.

### 🌟 Fase 1: Creazione del Componente Selettore Lingua

**Prompt da dare all'AI:**
```text
Crea un componente React chiamato `LanguageSelector.tsx` sotto `src/components/` con le seguenti specifiche:
1. Deve contenere una lista delle lingue principali (es. Italiano, Inglese, Spagnolo, Tedesco, Francese). Contrassegna il contenitore del menu con la classe "notranslate" per evitare che Google ne traduca i nomi.
2. All'avvio del componente (useEffect), deve iniettare dinamicamente nel `body` lo script asincrono di Google Translate:
   '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
3. Definisci la funzione globale `window.googleTranslateElementInit` per inizializzare il traduttore puntando a un div nascosto con id `google_translate_element`.
4. Gestisci il cambio di lingua manipolando il cookie `googtrans` (es. impostando il valore '/it/en' per tradurre da italiano a inglese) e ricaricando la pagina con `window.location.reload()`.
5. Progetta il dropdown in stile Glassmorphic usando Tailwind CSS, con un'icona a forma di mappamondo (Globe) e una freccetta (ChevronDown) di Lucide React.
```

---

### 🎨 Fase 2: Configurazione degli Stili Globali

**Prompt da dare all'AI:**
```text
Aggiungi le seguenti regole CSS personalizzate nel file di stile principale (es. `src/index.css` o `src/App.css`) per nascondere i widget nativi e fastidiosi di Google Translate ed evitare salti di layout:

/* Nasconde il widget originale di Google */
#google_translate_element {
  display: none !important;
}

/* Evita che Google sposti il body verso il basso di 40px */
body {
  top: 0px !important;
  position: static !important;
}

/* Nasconde i popup di traduzione al passaggio del mouse */
.goog-tooltip, .goog-tooltip:hover, .goog-text-highlight {
  display: none !important;
  box-shadow: none !important;
  background: transparent !important;
  border: none !important;
}
```

---

### 🔗 Fase 3: Integrazione nel Layout Principale

**Prompt da dare all'AI:**
```text
Integra il componente `<LanguageSelector />` nella Navbar principale del sito (sia nella versione Desktop che all'interno del menu a tendina Mobile). Assicurati che un div vuoto con id `google_translate_element` sia presente da qualche parte nel layout (es. alla fine di `App.tsx` o `index.html`) per consentire a Google di caricare i propri nodi nascosti.
```

---

## 🔍 Come Verificare che Funzioni
Una volta che l'AI ha eseguito i tre prompt:
1. Avvia il server di sviluppo locale (`npm run dev`).
2. Fai clic sul menu a tendina delle lingue e seleziona una lingua diversa (es. **English**).
3. La pagina si ricaricherà e tutti i testi statici e dinamici del tuo sito verranno tradotti istantaneamente.
4. Ispeziona il DOM nel browser per verificar che non ci siano barre o banner di Google Translate visibili.
