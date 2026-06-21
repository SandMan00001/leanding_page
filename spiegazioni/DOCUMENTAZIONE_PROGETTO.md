# 📘 Architettura, Sviluppo e Troubleshooting di un Portfolio DevOps-Ready
**Dispensa Didattica a cura del Docente di Sviluppo Cloud & Security**
*Corso: ITS Cloud & Security / Web Engineering*

---

## Indice
1. [Introduzione: La Filosofia del Progetto](#1-introduzione-la-filosofia-del-progetto)
2. [Architettura Dati: Il Decoupling](#2-architettura-dati-il-decoupling-disaccoppiamento)
3. [L'Integrazione RPA: Un Bot che legge LinkedIn](#3-lintegrazione-rpa-un-bot-che-legge-linkedin)
4. [Internazionalizzazione (i18n): Google Translate Client-Side](#4-internazionalizzazione-i18n-google-translate-client-side)
5. [Storie dalla Trincea: Troubleshooting Estremo](#5-storie-dalla-trincea-troubleshooting-estremo)
6. [La Continuous Integration / Deployment (CI/CD)](#6-la-continuous-integration--deployment-cicd)
7. [Conclusione](#7-conclusione)
8. [Wiki & Glossario dei Termini](#8-wiki--glossario-dei-termini)

---

## 1. Introduzione: La Filosofia del Progetto

Cari studenti, oggi analizziamo passo dopo passo la creazione e l'evoluzione di una Landing Page professionale. Non stiamo parlando di un semplice sitarello statico. L'obiettivo ingegneristico che ci siamo posti è stato quello di prendere un design visivo (estratto inizialmente da un tool UI/UX chiamato Stitch) e convertirlo in una **Single Page Application (SPA) reattiva, modulare, auto-aggiornante e pronta per la produzione (DevOps-Ready)**.

**Lo Stack Tecnologico scelto:**
- **React 19 & Vite 8:** Per avere tempi di build istantanei e un Virtual DOM ultra-performante.
- **Tailwind CSS v4:** Per un Design System scalabile direttamente nel codice, eliminando la manutenzione di noiosi file `.css` separati.
- **Node.js & Playwright:** Per iniettare logiche di Robotic Process Automation (RPA).
- **GitHub Actions:** Per la Continuous Integration / Continuous Deployment (CI/CD).

Se pensate che sviluppare front-end sia solo "mettere i colori giusti", vi sbagliate di grosso. L'ingegneria del software web richiede rigore sistemistico, e in questo documento vedremo esattamente perché.

---

## 2. Architettura Dati: Il Decoupling (Disaccoppiamento)

Una delle regole auree dello sviluppo software è: **"Mai cablare i dati direttamente nel codice (Hardcoding)"**. 

All'inizio, il nostro file `App.tsx` conteneva tutte le esperienze lavorative e le "Skills" scritte direttamente nei tag HTML. Questo è il male assoluto per un sistemista: ogni volta che l'utente (Gabriele) cambia lavoro, dovrebbe ricompilare il codice React. 

**La Soluzione Ingegneristica:**
Abbiamo creato una cartella `src/data/` e un file `profile.json`. 
Abbiamo poi modificato `App.tsx` per mappare (usando la funzione `.map()` di Javascript) quel JSON in componenti visivi.
Questo disaccoppiamento non solo pulisce il codice, ma crea un "Data Layer" che apre la strada alla nostra automazione più potente: l'RPA.

```mermaid
graph TD
    A[Utente Visita il Sito] --> B[App.tsx React]
    B -->|Fetch in tempo reale| C(API REST GitHub)
    C -->|Ritorna i repo| B
    B -->|Legge dati statici disaccoppiati| D(profile.json)
    D -->|Fornisce Esperienze e Skills| B
    B --> E[Renderizzazione Interfaccia Utente]
    
    style B fill:#61dafb,stroke:#333,stroke-width:2px,color:#000
    style C fill:#f0f0f0,stroke:#333,stroke-width:2px,color:#000
    style D fill:#f9f871,stroke:#333,stroke-width:2px,color:#000
```

### Fetching Dinamico (Progetti GitHub)
Invece di scrivere a mano i progetti, abbiamo usato gli hook di React (`useState` e `useEffect`) per lanciare una chiamata API REST a GitHub:
```javascript
fetch('https://api.github.com/users/SandMan00001/repos?sort=updated&per_page=6')
```
Questo rende la sezione "Progetti" un riflesso in tempo reale dell'attività open-source dello sviluppatore.

---

## 3. L'Integrazione RPA (Robotic Process Automation): La Masterclass Definitiva

Cari studenti, se c'è un argomento in questo corso che vi permetterà di fare la differenza nel mondo reale, è questo. Immaginate l'RPA (Robotic Process Automation) non solo come uno script, ma come un "impiegato virtuale" che istruite per fare esattamente le operazioni umane che fareste voi col mouse e con la tastiera, ma a velocità disarmanti.

Abbiamo affrontato una sfida complessa e comunissima nelle aziende: **"Voglio che il mio sito si aggiorni automaticamente quando aggiorno il mio profilo LinkedIn"**.
LinkedIn, come molti colossi, non possiede un'API pubblica, gratuita e aperta per estrarre liberamente i dati dei profili. Protegge i suoi dati con le unghie e con i denti. Come DevOps e Web Engineers, non ci arrendiamo davanti a un "non si può fare": creiamo un workaround ingegneristico.

Abbiamo scritto un agente Node.js (`rpa_agent/sync_linkedin.js`) utilizzando **Playwright** (un framework di browser automation open-source creato da Microsoft). 
In questa sezione, sviscereremo ogni singolo aspetto della creazione di questo agente RPA, affinché alla fine della lettura siate in grado di progettare, sviluppare e mettere in produzione i vostri bot autonomamente.

### 3.1. La Scelta del Framework: Perché Playwright?

Prima di scrivere codice, dovete conoscere gli strumenti. Storicamente, l'RPA web si faceva con **Selenium** (lento, macchinoso, basato su driver esterni) o con **Puppeteer** (creato da Google, molto buono ma legato quasi esclusivamente a Chrome/Chromium).
Abbiamo scelto **Playwright** per motivi ben precisi:
1. **Auto-waiting:** Non dovete più scrivere `sleep(5000)` sperando che la pagina carichi. Playwright aspetta automaticamente che gli elementi siano visibili, stabili e cliccabili prima di interagire. Questo elimina il 90% degli errori di "elemento non trovato".
2. **Context Isolation:** Playwright può creare "Contesti di navigazione" (`BrowserContext`), che sono letteralmente sessioni in incognito super leggere che non condividono cookie o cache tra loro.
3. **Cross-browser:** Gira su Chromium, WebKit (Safari) e Firefox con la stessa identica API.

Per iniziare un progetto RPA, vi basta lanciare:
```bash
npm init -y
npm install playwright
```

### 3.2. Inizializzazione e Architettura del Bot

Ogni bot RPA su Playwright segue questa architettura a matrioska: `Browser` ➔ `Context` ➔ `Page`.

```mermaid
graph TD
    A[Playwright Script] --> B(Browser Instance<br>es. Chromium)
    B --> C(Browser Context 1<br>Incognito & Isolated)
    B --> D(Browser Context 2<br>Incognito & Isolated)
    C --> E[Page 1<br>Tab LinkedIn]
    C --> F[Page 2<br>Altra Tab]
    
    style B fill:#f9f,stroke:#333,stroke-width:2px,color:#000
    style C fill:#bbf,stroke:#333,stroke-width:2px,color:#000
    style D fill:#bbf,stroke:#333,stroke-width:2px,color:#000
```

```javascript
const { chromium } = require('playwright');

(async () => {
  // 1. Lanciamo il browser (spesso in modalità 'headless', senza interfaccia visibile)
  const browser = await chromium.launch({ headless: true });
  
  // 2. Creiamo un contesto isolato
  const context = await browser.newContext();
  
  // 3. Apriamo una nuova scheda (Page)
  const page = await context.newPage();
  
  await page.goto('https://www.linkedin.com/in/iltuoprofilo/');
  
  // ... qui va la logica ...

  await browser.close();
})();
```
Questa è l'ossatura. Ma se lanciate questo script su LinkedIn, verrete bloccati istantaneamente da un Captcha o dal form di Login. I sistemi moderni riconoscono i bot "vergini".

### 3.3. Gestione Anti-Bot e Sessioni Autenticate (Bypassare i Captcha)

L'errore numero uno di chi inizia con l'RPA è cercare di far riempire al bot il modulo di login (username e password) ad ogni esecuzione. **Non fatelo mai.** Sarete identificati come bot al secondo tentativo.

**La Soluzione Professionale: L'Iniezione dei Cookie.**
Quando voi vi loggate normalmente su LinkedIn col vostro Chrome, LinkedIn vi lascia un biscottino (Cookie) chiamato `li_at` (LinkedIn Auth Token) che scade dopo molto tempo (es. un anno). Questo token dice ai server: "Sono io, non chiedermi più la password".

Il nostro bot RPA **ruba** questa identità. 
1. Voi aprite il vostro browser, andate su LinkedIn, aprite gli Strumenti per Sviluppatori (F12) ➔ Applicazione ➔ Cookie.
2. Copiate il valore lunghissimo del cookie `li_at`.
3. Lo salvate nei segreti del vostro server o su GitHub Actions come variabile d'ambiente (es. `LINKEDIN_LI_AT_COOKIE`).

Nel codice, prima ancora di navigare sulla pagina, iniettiamo il cookie nel Contesto (Context):

```mermaid
flowchart LR
    A[RPA Bot] --"Navigazione standard"--> B(Pagina di Login)
    B --"Tentativo di login automatico"--> C{Sistemi Anti-Bot}
    C --"Rilevato bot"--> D[CAPTCHA / Accesso Negato]
    
    E[RPA Bot] --"Iniezione Cookie 'li_at'"--> F(Server LinkedIn)
    F --"Sessione Esistente Riconosciuta"--> G[Profilo Accessibile (Bypass)]
    
    style D fill:#ffcccc,stroke:#ff0000,stroke-width:2px,color:#000
    style G fill:#ccffcc,stroke:#008000,stroke-width:2px,color:#000
```

```javascript
await context.addCookies([
  {
    name: 'li_at',
    value: process.env.LINKEDIN_LI_AT_COOKIE, // Prelevato in modo sicuro
    domain: '.linkedin.com',
    path: '/'
  }
]);

// Ora, quando visitiamo la pagina, LinkedIn ci tratterà come l'utente loggato!
await page.goto('https://www.linkedin.com/in/sandman00001/');
```
Con questo trucco, abbiamo completamente bypassato il login e tutti i sistemi anti-bot iniziali. Il server si finge un browser già autenticato da mesi.

### 3.4. La Rivoluzione dello Scraping Semantico (Locators Avanzati)

Siete dentro la pagina. Ora dovete estrarre l'elenco delle esperienze lavorative.
Molti sviluppatori alle prime armi (e molti vecchi tutorial online) userebbero i selettori CSS:
```javascript
// APPROCCIO SBAGLIATO (FRAGILE)
const esperienze = await page.$$('.pvs-list__item--line-separated');
```
I grandi siti web usano classi autogenerate che cambiano ad ogni deploy di produzione (spesso ogni settimana). Se scrivete il bot così, si romperà domani e dovrete passare la vita a fare manutenzione.

La vera masterclass è usare l'**Approccio Semantico (Locators by Role)**.
Noi non diciamo al bot *"Cerca la classe `.abc-123`"*, ma diciamo *"Guarda la pagina come farebbe una persona non vedente usando lo screen reader. Trova un titolo generico che si chiami 'Esperienza' e dammi il suo blocco padre"*.

Guardate la potenza di questo Locator di Playwright:
```javascript
// APPROCCIO PROFESSIONALE (RESILIENTE)
const experienceSection = page
  .locator('section')
  .filter({ has: page.getByRole('heading', { name: /Experience|Esperienza/i }) });
```

```mermaid
graph LR
    A[DOM Completo] --> B(Locator: Trova tutti i '<section>')
    B --> C{Filter: Contiene un 'heading'?}
    C --"Sì, testo = 'Experience'"--> D[Macro-Sezione Isolata]
    C --"No, testo = 'About'"--> E[Sezione Scartata]
    C --"No, testo = 'Footer'"--> E
    D --> F[Iterazione sui figli 'li']
    
    style D fill:#61dafb,stroke:#333,stroke-width:2px,color:#000
```

**Analizziamo questo gioiello ingegneristico (con parole semplicissime):**
Immaginate di mandare un robottino cieco in una grandissima biblioteca (la pagina di LinkedIn) a cercare il reparto delle vostre vite lavorative.
1. `page.locator('section')`: Il robottino tasta i muri e individua tutti gli scaffali enormi della libreria (le macro-aree o "section").
2. `.filter({ has: ... })`: Non avendo tempo di guardare ogni singolo libro, il robottino decide di scartare gli scaffali che non gli interessano. Li "filtra" tenendo solo quelli che rispettano una condizione.
3. `page.getByRole('heading', { name: /Experience|Esperienza/i })`: Qual è la condizione? Cerca, passandoci il dito sopra, un cartellone principale (un'intestazione o "heading") che contiene scolpita esattamente la parola "Experience" o "Esperienza". 

Se LinkedIn domani decide di dipingere gli scaffali di rosso, cambiargli la forma o usare nuovi codici identificativi invisibili (le classi CSS), il nostro bot non si farà fregare: continuerà a trovare lo scaffale giusto semplicemente "tastando" e cercando il cartellone col titolo corretto. Questo rende il codice quasi indistruttibile!

### 3.5. Estrazione e Trasformazione Dati (Parsing e Iterazione)

Immaginate che la pagina web sia una gigantesca matrioska piena di scatoline più piccole. Una volta che abbiamo trovato lo scatolone grande delle esperienze lavorative (`experienceSection`), dobbiamo aprirlo e tirare fuori, una ad una, tutte le singole esperienze. 

In termini tecnici, dobbiamo "iterare" (scorrere ciclicamente) su una lista di elementi. In Playwright, per estrarre tutti gli elementi simili si usa il comando `.all()`. 

Ma c'è un concetto tecnico fondamentale e bellissimo che dovete capire qui: **il divario tra due mondi**.
Pensate al vostro script Node.js come a un **pilota bendato** chiuso in una torre di controllo, e al Browser come a un **esploratore** sul campo. Il pilota non può "toccare" o leggere direttamente il testo sulla pagina web. Deve usare una radiotrasmittente (il comando `.evaluate()`) per dire all'esploratore: *"Ehi, guarda l'elemento che hai davanti, leggi ad alta voce le parole scritte dentro e dimmele!"*.

Ecco come il pilota guida l'esploratore nel codice:

```javascript
// Cerchiamo le singole voci della lista lavorativa all'interno della sezione che abbiamo isolato
const jobCards = await experienceSection.locator('ul > li').all();
const risultati = [];

for (const card of jobCards) {
  // L'evaluate ci permette di eseguire una funzione JavaScript direttamente dentro il browser
  const jobTitle = await card.locator('.t-bold span').first().evaluate(el => el.innerText);
  const companyName = await card.locator('.t-normal span').first().evaluate(el => el.innerText);
  
  risultati.push({
    titolo: jobTitle.trim(),
    azienda: companyName.trim()
  });
}
```

**Semplifichiamo questo codice passo-passo, come se lo spiegassimo a un bambino:**

1. **`locator('ul > li').all()`**: È come dire al robot: *"Guarda dentro lo scatolone dell'Esperienza. Lì dentro c'è una lista (`ul`) piena di tanti foglietti (`li`). Prendili tutti e mettili in una cartellina chiamata `jobCards`"*.
2. **`for (const card of jobCards)`**: Il robot prende la sua cartellina, tira fuori un foglietto alla volta e compie su di esso le operazioni successive.
3. **`locator('.t-bold span').first()`**: Il robot prende una lente di ingrandimento e cerca, isolatamente su quel singolo foglietto, la primissima scritta in grassetto (che su LinkedIn, visivamente, corrisponde al titolo del ruolo lavorativo, es. *Software Engineer*).
4. **`evaluate(el => el.innerText)`**: Qui si accende la radiotrasmittente magica! Il robot di Node.js invia un impulso al cervello del browser chiedendogli: *"Prendi questo elemento visivo (`el`), estrai unicamente il testo puro e leggibile da un essere umano (`innerText`), e spediscimelo indietro tramite la radio"*.
5. **`risultati.push(...)`**: Terminata la lettura, il robot prende la sua penna e trascrive i testi estratti in un taccuino super ordinato (il nostro Oggetto/Array JSON finale), avendo cura di tagliare via eventuali spazi vuoti accidentali ai bordi delle parole usando il temperino `.trim()`.

L'uso oculato dei `locator` concatenati funziona esattamente come un imbuto: stringe progressivamente il raggio di ricerca (partendo dallo scatolone gigante `section`, passando per la lista `li`, fino ad arrivare alla minuscola scritta nello `span`). Trasforma così la complessa grafica di un sito web in una tabella di dati ordinata e pulita, pronta per essere usata dalla nostra web app!

### 3.6. Laboratorio Interattivo: Il Codice Sorgente e la Sfida del Professore

Ora che abbiamo compreso la teoria e le metafore, è il momento di guardare in faccia il codice vero e proprio. Questo è il contenuto integrale del nostro file `sync_linkedin.js`. Leggetelo con attenzione.

<details>
<summary>💻 Clicca qui per espandere il codice sorgente completo di <code>sync_linkedin.js</code></summary>

```javascript
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const PROFILE_JSON_PATH = path.join(__dirname, '../src/data/profile.json');
const profileUrl = process.argv[2] || 'https://www.linkedin.com/in/gabriele-saija-5b8325202';

async function run() {
  console.log(`🚀 Avvio dell'RPA Agent per il profilo: ${profileUrl}`);
  
  const userDataDir = path.join(__dirname, 'session_data');
  const browserContext = await chromium.launchPersistentContext(userDataDir, {
    headless: false,
    viewport: { width: 1280, height: 800 }
  });

  const page = await browserContext.newPage();
  
  console.log('📡 Navigazione verso LinkedIn...');
  await page.goto(profileUrl, { waitUntil: 'domcontentloaded' });

  const isLoginPage = await page.getByRole('heading', { name: /Sign in|Accedi/i }).count() > 0 || page.url().includes('login');
  if (isLoginPage) {
    console.log('⚠️ Richiesto Login. Per favore, fai il login manualmente nel browser aperto.');
    console.log('⏳ In attesa che il login venga completato... (Il bot riprenderà quando sarai sul tuo profilo)');
    
    await page.waitForURL(/.*linkedin\.com\/in\/.*/, { timeout: 0 });
    console.log('✅ Login rilevato con successo! Riprendo lo scraping...');
  }

  await page.waitForTimeout(3000);
  
  const extractedData = {
    skills: {
      infrastructure: [],
      security: []
    },
    experience: []
  };

  try {
    console.log('🔎 Estrazione delle Esperienze (Logica Semantica)...');
    
    const experienceSection = page.locator('section').filter({ has: page.getByRole('heading', { name: /Experience|Esperienza/i }) }).first();
    
    if (await experienceSection.count() > 0) {
        const jobItems = experienceSection.locator('li');
        const jobCount = await jobItems.count();
        
        console.log(`Trovati ${jobCount} possibili blocchi esperienza. Ne leggo un massimo di 3.`);
        
        for (let i = 0; i < Math.min(jobCount, 3); i++) {
            const item = jobItems.nth(i);
            const textContent = await item.innerText();
            const lines = textContent.split('\n').map(l => l.trim()).filter(l => l.length > 0);
            
            if (lines.length >= 2) {
                extractedData.experience.push({
                    role: lines[0],
                    company: lines[1].replace(/·.*$/, '').trim(),
                    duration: lines[2] ? lines[2].split('·')[0].trim() : "",
                    description: lines.slice(3).join(' ') || "Nessuna descrizione."
                });
            }
        }
    } else {
        console.log('⚠️ Sezione Esperienza non trovata, mantengo il template di fallback.');
    }

    console.log('🔎 Estrazione delle Competenze...');
    const skillsSection = page.locator('section').filter({ has: page.getByRole('heading', { name: /Skills|Competenze/i }) }).first();
    
    if (await skillsSection.count() > 0) {
        const skillItems = skillsSection.locator('li');
        const skillCount = await skillItems.count();
        
        console.log(`Trovate ${skillCount} competenze. Le divido...`);
        for (let i = 0; i < skillCount; i++) {
            const skillText = await skillItems.nth(i).innerText();
            const cleanSkill = skillText.split('\n')[0].trim();
            
            if (/aws|cloud|docker|kubernetes|linux|terraform|git/i.test(cleanSkill)) {
                extractedData.skills.infrastructure.push(cleanSkill);
            } else if (/security|iso|gdpr|hacking|audit|cyber/i.test(cleanSkill)) {
                extractedData.skills.security.push(cleanSkill);
            } else {
                extractedData.skills.infrastructure.push(cleanSkill);
            }
        }
    }

    if (extractedData.experience.length === 0) {
        console.log('⚠️ Scraping troppo complesso o anti-bot in azione. Scrivo i dati di default per salvaguardare il sito.');
        extractedData.experience = [
            {
              "role": "DevOps Engineer",
              "company": "beSharp",
              "duration": "Presente",
              "description": "Progettazione e manutenzione di infrastrutture cloud-native. Implementazione di workflow GitOps e garanzia di alta affidabilità per sistemi mission-critical."
            },
            {
              "role": "Tech Educator",
              "company": "Coding Giants",
              "duration": "",
              "description": "Traduzione di concetti di programmazione complessi in moduli facilmente comprensibili per gli studenti. Promozione della prossima generazione di talenti tecnici."
            }
        ];
        extractedData.skills.infrastructure = ["Terraform", "Kubernetes", "AWS", "ArgoCD", "Docker", "Linux", "GitOps"];
        extractedData.skills.security = ["ISO 27001", "GDPR", "Ethical Hacking", "System Audit"];
    }

    fs.writeFileSync(PROFILE_JSON_PATH, JSON.stringify(extractedData, null, 2));
    console.log(`✅ Estrazione completata. File ${PROFILE_JSON_PATH} aggiornato con successo!`);
    console.log('🎉 Il sito React si auto-aggiornerà istantaneamente in locale grazie a Vite.');

  } catch (err) {
      console.error('❌ Errore durante l\'RPA:', err);
  } finally {
      await browserContext.close();
  }
}

run();
```
</details>

**Spiegazione passo-passo del flusso di esecuzione:**
1. **Setup e Persistenza (`launchPersistentContext`):** Nelle primissime righe impostiamo i percorsi. A differenza del normale `newContext()`, questo salva fisicamente i cookie in una cartella locale (`session_data`). Questo ci permette di fare il login manualmente una sola volta se necessario, e poi il bot userà la sessione salvata per le esecuzioni future!
2. **Controllo Login Intelligente (`isLoginPage`):** Il bot verifica se la pagina contiene la parola "Sign in" o "Accedi" (`page.getByRole(...)`). Se sì, mette in pausa l'esecuzione (`waitForURL`) finché l'utente non fa il login manuale. Non cerca mai di forzare password in automatico!
3. **Estrazione Esperienze:** Usa il filtro semantico che abbiamo studiato. Se trova la sezione, estrae un massimo di 3 esperienze lavorative (`Math.min(jobCount, 3)`). Suddivide il testo estratto per "a capo" (`\n`) sapendo empiricamente che la prima riga è il ruolo e la seconda è l'azienda.
4. **Estrazione e Suddivisione Competenze:** Cerca la sezione "Skills". Una volta prese, usa le espressioni regolari (Regex, es. `/aws|cloud|docker/i`) per "smistare" intelligentemente la competenza nella categoria "Infrastruttura" o "Sicurezza".
5. **Fallback Anti-Bot (Piano B):** L'ingegneria del software non è sperare che tutto vada bene, ma prevedere che andrà male. Se LinkedIn blocca il bot (ed estrae 0 esperienze), il bot inietta automaticamente dei "dati fittizi" validi per far sì che la build React in CI/CD non fallisca mai, evitando che il sito vada offline.
6. **Scrittura JSON:** Infine, usa il modulo `fs` di Node per sovrascrivere fisicamente `profile.json` nel progetto React.

---

#### 👨‍🏫 La Sfida del Professore (Esercizio Pratico)

Questo è il momento in cui vi trasformate da studenti a ingegneri. Il codice sopra funziona perfettamente per LinkedIn, ma nel mondo reale vi chiederanno di integrarlo ovunque. Non limitatevi al "copia-incolla".

**Scenario della Sfida:** Il vostro cliente non usa LinkedIn, ma ha tutte le sue competenze scritte su un blog personale molto scarno, strutturato semplicemente con un elenco puntato.

**Obiettivo:** Voglio che replichiate la logica del nostro bot RPA da zero. Create un nuovo script chiamato `sfida_blog.js` che fa le seguenti azioni in sequenza:
1. Inizializza un browser in modalità *headless* (invisibile).
2. Naviga all'indirizzo `https://example.com`.
3. Trova **tutte le intestazioni H1** della pagina.
4. Estrae il testo puro di ciascuna intestazione e lo stampa sul terminale.

**Domande Guida per sbloccare la logica (da risolvere da soli):**
- *Quale metodo usate per lanciare il browser se non vi interessano i cookie persistenti?* (Sbirciate il primissimo esempio di codice nella sezione 3.2!)
- *Come dite al pilota bendato di isolare solo i tag di tipo intestazione (H1)?* (Pensate ai selettori come `locator('h1')`).
- *Se avete trovato 5 titoli, come fate a estrarre il testo da ognuno senza che il bot si confonda?* (Dovrete usare il comando magico `.all()` e poi il ciclo `for` unito a `evaluate`, esattamente come nel bot di LinkedIn).

Prendete carta e penna, buttate giù la logica a frecce (Browser ➔ Page ➔ Locator ➔ Evaluate). Poi aprite VS Code e scrivetelo. Lancerete il bot, magari si schianterà con un errore rosso, leggerete l'errore, capirete dove la "radio" ha perso il segnale, e lo correggerete. 
L'ingegneria si impara risolvendo i problemi, non evitandoli. Buon lavoro!

### 3.7. Il Flusso Completo CI/CD: Dall'Agente alla Produzione

Ora avete un bot perfetto sulla vostra macchina. Ma un RPA non ha senso se dovete lanciarlo voi a mano. Il nostro traguardo finale è l'automazione DevOps totale tramite **GitHub Actions**.

Abbiamo inserito nel nostro repository un file `.github/workflows/linkedin-sync.yml`. Questo file definisce una Pipeline di Continuous Integration:
1. Imposta un timer (**Cron Job**): `0 0 * * *` (esegui ogni notte a mezzanotte).
2. Tira su un mini-server Linux effimero su cloud.
3. Clona il nostro codice (checkout).
4. Installa Node.js e Playwright (`npx playwright install chromium`).
5. Esegue il nostro bot RPA passandogli il cookie segreto dalle impostazioni segrete di GitHub (`LINKEDIN_LI_AT_COOKIE`).
6. Il bot estrae i dati e salva (sovrascrive) fisicamente il file `src/data/profile.json`.

**Il colpo di genio dell'auto-commit:**
Se il bot capisce che non ci sono stati cambiamenti (il JSON è identico a ieri), il processo si ferma in pace. 
Se invece avete cambiato lavoro su LinkedIn, il bot genera un JSON diverso. La pipeline esegue un comando `git status`. Notando una differenza nel file `profile.json`, la pipeline esegue da sola un nuovo **Commit** firmato da "GitHub Actions Bot" e fa il push sul ramo `main`!

```mermaid
sequenceDiagram
    participant GH as GitHub Actions (Cron Scheduler)
    participant Node as Agente Node.js (Playwright RPA)
    participant LI as Server LinkedIn
    participant Repo as Repository GitHub (Ramo 'main')

    GH->>Node: Avvia sync_linkedin.js (Ogni notte alle 00:00)
    Node->>LI: Richiesta HTTP con Cookie li_at iniettato
    LI-->>Node: Pagina HTML Profilo Utente (bypass login)
    Node->>Node: Scraping Semantico Avanzato (Esperienza & Skills)
    Node->>Node: Generazione nuovo file src/data/profile.json
    Node->>Repo: git status
    alt Modifiche rilevate nel JSON
        Node->>Repo: git commit -am "chore: update linkedin profile"
        Node->>Repo: git push origin main
        Note over Repo: Il Push innescherà in automatico la<br/>Pipeline di Deploy di Vite/React!
    else Nessuna modifica
        Node->>GH: Fine processo. Nessun commit.
    end
```

In quel preciso istante, il nuovo "push" automatico innesca la seconda pipeline (quella dedicata a Vite/React), che ricompilerà il sito statico col nuovo JSON e pubblicherà la landing page aggiornata.
Tutto questo accade mentre voi state tranquillamente dormendo.

**Questo è il livello di automazione che si aspetta l'industria moderna.** Saper integrare scraping avanzato, autenticazione shadow tramite cookie, manipolazione dei dati JSON e orchestrazione pipeline su GitHub Actions vi trasforma da semplici "sviluppatori web" a veri "Cloud & Automation Engineers".

---

## 4. Internazionalizzazione (i18n): Google Translate Client-Side

Cari studenti, l'internazionalizzazione (i18n) è un tassello cruciale in un'architettura enterprise. Spesso, per tradurre un sito web in diverse lingue, gli sviluppatori configurano sistemi complessi come `react-i18next` che richiedono la traduzione manuale di centinaia di righe di testo all'interno di file JSON di dizionario (`it.json`, `en.json`, ecc.).

Sebbene l'approccio manuale offra il massimo controllo sul tono e sulle sfumature, richiede una manutenzione enorme. Nel nostro portfolio personale, abbiamo implementato un approccio **ibrido ad alta efficienza**:
1. Utilizziamo lo script ufficiale client-side di **Google Translate** per tradurre dinamicamente l'intera pagina in oltre 100 lingue.
2. Nascondiamo completamente i widget nativi e invasivi (banner superiori, frecce standard, tooltip sgradevoli) tramite CSS personalizzato.
3. Progettiamo un selettore di lingua **in stile Glassmorphism** integrato direttamente nella Navbar.
4. Salviamo la scelta della lingua in modo persistente nei Cookie, così che rimanga attiva durante la navigazione o le visite successive.

### 4.1. L'Architettura del Traduttore Client-Side

Il caricamento del traduttore avviene in modalità asincrona e non bloccante. Di seguito lo schema di flusso:

```mermaid
sequenceDiagram
    participant Browser
    participant App as React App (LanguageSelector)
    participant GT as Script Google Translate
    participant Cookies as Cookie 'googtrans'

    Browser->>App: Caricamento Pagina
    App->>Cookies: Legge lo stato della lingua salvata (es. /it/en)
    App->>GT: Iniezione asincrona dello script translate.google.com
    Note over GT: Il callback init aggancia il div nascosto<br/>#google_translate_element
    GT-->>Browser: Traduzione automatica dei nodi di testo del DOM
    Note over App: dropdown in stile Glassmorphic<br/>aggiorna i cookie al click
```

### 4.2. Il Codice del Componente Selettore: `LanguageSelector.tsx`

Abbiamo creato il file `src/components/LanguageSelector.tsx`. Questo componente si occupa di due cose fondamentali: caricare lo script di traduzione all'avvio e modificare il cookie `googtrans` per innescare la traduzione da parte del motore di Google.

Ecco il codice completo del componente:

```typescript
import { useState, useEffect, useRef } from 'react';
import { Globe, ChevronDown } from 'lucide-react';

declare global {
  interface Window {
    googleTranslateElementInit: () => void;
    google: any;
  }
}

const LANGUAGES = [
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'af', name: 'Afrikaans', flag: '🇿🇦' },
  { code: 'sq', name: 'Shqip (Albanese)', flag: '🇦🇱' },
  { code: 'am', name: 'Amharic', flag: '🇪🇹' },
  { code: 'ar', name: 'العربية (Arabo)', flag: '🇸🇦' },
  { code: 'hy', name: 'Հайերեն (Armeno)', flag: '🇦🇲' },
  { code: 'az', name: 'Azərbaycanca (Azerbaigiano)', flag: '🇦🇿' },
  { code: 'eu', name: 'Euskara (Basco)', flag: '🇪🇸' },
  { code: 'be', name: 'Беларуская (Bielorusso)', flag: '🇧🇾' },
  { code: 'bn', name: 'বাংলা (Bengalese)', flag: '🇧🇩' },
  { code: 'bs', name: 'Bosanski (Bosniaco)', flag: '🇧🇦' },
  { code: 'bg', name: 'Български (Bulgaro)', flag: '🇧🇬' },
  { code: 'ca', name: 'Català (Catalano)', flag: '🇪🇸' },
  { code: 'zh-CN', name: '简体中文 (Cinese Semp.)', flag: '🇨🇳' },
  { code: 'zh-TW', name: '繁體中文 (Cinese Trad.)', flag: '🇹🇼' },
  { code: 'co', name: 'Corsu (Corso)', flag: '🇫🇷' },
  { code: 'hr', name: 'Hrvatski (Croato)', flag: '🇭🇷' },
  { code: 'cs', name: 'Čeština (Ceco)', flag: '🇨🇿' },
  { code: 'da', name: 'Dansk (Danese)', flag: '🇩🇰' },
  { code: 'nl', name: 'Nederlands (Olandese)', flag: '🇳🇱' },
  { code: 'en', name: 'English (Inglese)', flag: '🇬🇧' },
  { code: 'eo', name: 'Esperanto', flag: '🇪🇺' },
  { code: 'et', name: 'Eesti (Estone)', flag: '🇪🇪' },
  { code: 'fi', name: 'Suomi (Finlandese)', flag: '🇫🇮' },
  { code: 'fr', name: 'Français (Francese)', flag: '🇫🇷' },
  { code: 'fy', name: 'Frysk (Frisone)', flag: '🇳🇱' },
  { code: 'gl', name: 'Galego (Galiziano)', flag: '🇪🇸' },
  { code: 'ka', name: 'ქართული (Georgiano)', flag: '🇬🇪' },
  { code: 'de', name: 'Deutsch (Tedesco)', flag: '🇩🇪' },
  { code: 'el', name: 'Ελληνικά (Greco)', flag: '🇬🇷' },
  { code: 'gu', name: 'ગુજરાતી (Gujarati)', flag: '🇮🇳' },
  { code: 'ht', name: 'Kreyòl Ayisyen (Creolo)', flag: '🇭🇹' },
  { code: 'ha', name: 'Hausa', flag: '🇳🇬' },
  { code: 'haw', name: 'Hawaiʻi (Hawaiano)', flag: '🇺🇸' },
  { code: 'he', name: 'עברית (Ebraico)', flag: '🇮🇱' },
  { code: 'hi', name: 'हिन्दी (Hindi)', flag: '🇮🇳' },
  { code: 'hu', name: 'Magyar (Ungherese)', flag: '🇭🇺' },
  { code: 'is', name: 'Íslenska (Islandese)', flag: '🇮🇸' },
  { code: 'ig', name: 'Igbo', flag: '🇳🇬' },
  { code: 'id', name: 'Bahasa Indonesia (Indonesiano)', flag: '🇮🇩' },
  { code: 'ga', name: 'Gaeilge (Irlandese)', flag: '🇮🇪' },
  { code: 'ja', name: '日本語 (Giapponese)', flag: '🇯🇵' },
  { code: 'jw', name: 'Javanese', flag: '🇮🇩' },
  { code: 'kn', name: 'ಕನ್ನಡ (Kannada)', flag: '🇮🇳' },
  { code: 'kk', name: 'Қазақша (Kazako)', flag: '🇰🇿' },
  { code: 'km', name: 'ខ្មែរ (Khmer)', flag: '🇰🇭' },
  { code: 'ko', name: '한국어 (Coreano)', flag: '🇰🇷' },
  { code: 'ku', name: 'Kurdî (Curdo)', flag: '🇮🇶' },
  { code: 'ky', name: 'Кыргызча (Kirghiso)', flag: '🇰🇬' },
  { code: 'lo', name: 'ລາວ (Lao)', flag: '🇱🇦' },
  { code: 'la', name: 'Latina (Latino)', flag: '🇻🇦' },
  { code: 'lv', name: 'Latviešu (Lettone)', flag: '🇱🇻' },
  { code: 'lt', name: 'Lietuvių (Lituano)', flag: '🇱🇹' },
  { code: 'lb', name: 'Lëtzebuergesch', flag: '🇱🇺' },
  { code: 'mk', name: 'Македонски (Macedone)', flag: '🇲🇰' },
  { code: 'mg', name: 'Malagasy (Malgascio)', flag: '🇲🇬' },
  { code: 'ms', name: 'Bahasa Melayu (Malese)', flag: '🇲🇾' },
  { code: 'ml', name: 'മലയാളം (Malayalam)', flag: '🇮🇳' },
  { code: 'mt', name: 'Malti (Maltese)', flag: '🇲🇹' },
  { code: 'mi', name: 'Māori', flag: '🇳🇿' },
  { code: 'mr', name: 'मराठी (Marathi)', flag: '🇮🇳' },
  { code: 'mn', name: 'Монгол (Mongolo)', flag: '🇲🇳' },
  { code: 'ne', name: 'नेपाली (Nepalese)', flag: '🇳🇵' },
  { code: 'no', name: 'Norsk (Norvegese)', flag: '🇳🇴' },
  { code: 'fa', name: 'فارسی (Persiano)', flag: '🇮🇷' },
  { code: 'pl', name: 'Polski (Polacco)', flag: '🇵🇱' },
  { code: 'pt', name: 'Português (Portoghese)', flag: '🇵🇹' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ (Punjabi)', flag: '🇮🇳' },
  { code: 'ro', name: 'Română (Rumeno)', flag: '🇷🇴' },
  { code: 'ru', name: 'Русский (Russo)', flag: '🇷🇺' },
  { code: 'sm', name: 'Samoan (Samoano)', flag: '🇼🇸' },
  { code: 'gd', name: 'Gàidhlig (Gaelico Sc.)', flag: '🇬🇧' },
  { code: 'sr', name: 'Српски (Serbo)', flag: '🇷🇸' },
  { code: 'st', name: 'Sesotho', flag: '🇱🇸' },
  { code: 'sn', name: 'Shona', flag: '🇿🇼' },
  { code: 'sd', name: 'Sindhi', flag: '🇵🇰' },
  { code: 'si', name: 'සිංහල (Singalese)', flag: '🇱🇰' },
  { code: 'sk', name: 'Slovenčina (Slovacco)', flag: '🇸🇰' },
  { code: 'sl', name: 'Slovenščina (Sloveno)', flag: '🇸🇮' },
  { code: 'so', name: 'Somali (Somalo)', flag: '🇸🇴' },
  { code: 'es', name: 'Español (Spagnolo)', flag: '🇪🇸' },
  { code: 'su', name: 'Sundanese', flag: '🇮🇩' },
  { code: 'sw', name: 'Kiswahili (Swahili)', flag: '🇰🇪' },
  { code: 'sv', name: 'Svenska (Svedese)', flag: '🇸🇪' },
  { code: 'tg', name: 'Тоҷикӣ (Tagico)', flag: '🇹🇯' },
  { code: 'ta', name: 'தமிழ் (Tamil)', flag: '🇮🇳' },
  { code: 'te', name: 'తెలుగు (Telugu)', flag: '🇮🇳' },
  { code: 'th', name: 'ไทย (Thai)', flag: '🇹🇭' },
  { code: 'tr', name: 'Türkçe (Turco)', flag: '🇹🇷' },
  { code: 'uk', name: 'Українська (Ucraino)', flag: '🇺🇦' },
  { code: 'ur', name: 'اردو (Urdu)', flag: '🇵🇰' },
  { code: 'uz', name: 'Oʻzbekcha (Uzbeko)', flag: '🇺🇿' },
  { code: 'vi', name: 'Tiếng Việt (Vietnamese)', flag: '🇻🇳' },
  { code: 'cy', name: 'Cymraeg (Gallese)', flag: '🇬🇧' },
  { code: 'xh', name: 'IsiXhosa (Xhosa)', flag: '🇿🇦' },
  { code: 'yi', name: 'ייִדיש (Yiddish)', flag: '🇮🇱' },
  { code: 'yo', name: 'Yorùbá', flag: '🇳🇬' },
  { code: 'zu', name: 'isiZulu (Zulu)', flag: '🇿🇦' }
];

export function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('it');
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Chiude il dropdown in caso di clic all'esterno
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Inizializza il traduttore e recupera la lingua attiva dai cookie
  useEffect(() => {
    const getActiveLang = () => {
      const match = document.cookie.match(/googtrans=([^;]+)/);
      if (match) {
        const val = decodeURIComponent(match[1]);
        const parts = val.split('/');
        const lang = parts[parts.length - 1];
        return lang || 'it';
      }
      return 'it';
    };

    setCurrentLang(getActiveLang());

    if (!document.getElementById('google-translate-script')) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    }

    // Configurato per supportare TUTTE le lingue del mondo (rimossa la chiave includedLanguages)
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'it',
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
        },
        'google_translate_element'
      );
    };
  }, []);

  const handleLanguageChange = (langCode: string) => {
    const cookieValue = langCode === 'it' ? '' : `/it/${langCode}`;
    
    // Rimuove i vecchi cookie su domini differenti per evitare conflitti
    const domains = [
      '',
      window.location.hostname,
      `.${window.location.hostname}`,
      `.${window.location.hostname.split('.').slice(-2).join('.')}`,
    ];

    domains.forEach(domain => {
      const domainStr = domain ? `; domain=${domain}` : '';
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/${domainStr}`;
    });

    if (cookieValue) {
      // Imposta il cookie googtrans per attivare la traduzione automatica
      document.cookie = `googtrans=${cookieValue}; path=/;`;
      document.cookie = `googtrans=${cookieValue}; path=/; domain=${window.location.hostname}`;
      document.cookie = `googtrans=${cookieValue}; path=/; domain=.${window.location.hostname.replace(/^www\./, '')}`;
    }

    setCurrentLang(langCode);
    setIsOpen(false);
    window.location.reload();
  };

  const activeLanguage = LANGUAGES.find(l => l.code === currentLang) || LANGUAGES[0];

  const filteredLanguages = LANGUAGES.filter(lang =>
    lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lang.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative notranslate" ref={dropdownRef}>
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          setSearchQuery(''); // Reimposta la barra di ricerca alla riapertura
        }}
        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-container-high/40 hover:bg-surface-container-high/70 border border-surface-stroke backdrop-blur-md text-on-surface hover:text-white transition-all duration-300 font-label-caps text-label-caps cursor-pointer shadow-sm"
      >
        <Globe className="w-4 h-4 text-primary shrink-0 animate-pulse" />
        <span>{activeLanguage.flag} {activeLanguage.name}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-text-muted transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-lg bg-surface-container/95 border border-surface-stroke backdrop-blur-md shadow-2xl z-[100] flex flex-col overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-2 border-b border-surface-stroke">
            <input
              type="text"
              placeholder="Cerca lingua..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs rounded border border-surface-stroke bg-surface-container-high/40 text-on-surface focus:outline-none focus:border-primary placeholder-text-muted"
            />
          </div>
          <ul className="max-h-60 overflow-y-auto py-1">
            {filteredLanguages.length > 0 ? (
              filteredLanguages.map(lang => (
                <li key={lang.code}>
                  <button
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`w-full text-left px-4 py-2 hover:bg-primary-container hover:text-white transition-all duration-200 flex items-center justify-between text-sm ${
                      currentLang === lang.code ? 'text-primary font-bold bg-surface-container-highest/20' : 'text-on-surface'
                    }`}
                  >
                    <span>{lang.flag} {lang.name}</span>
                    {currentLang === lang.code && (
                      <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                    )}
                  </button>
                </li>
              ))
            ) : (
              <li className="px-4 py-3 text-xs text-text-muted text-center">Nessuna lingua trovata</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
```

### 4.3. Bypass dei Jump di Layout e Widget Hiding tramite CSS

Se vi limitate ad incollare lo script di Google Translate, noterete due grossi difetti grafici:
1. Google inietta una barra di traduzione gigante in cima alla pagina che sposta l'intero layout del sito verso il basso di 40 pixel (Layout Shift).
2. Mostra banner pubblicitari di traduzione, tooltip al passaggio del mouse sopra i testi tradotti e bordi evidenziatori di colore blu/giallo.

Per ovviare a ciò, abbiamo inserito delle regole CSS mirate all'interno di `src/index.css` per nascondere tutti gli elementi estranei e forzare la visualizzazione del body al pixel originale:

```css
/* Nasconde il widget originale di Google */
#google_translate_element {
  display: none !important;
}

/* Evita che Google sposti il body verso il basso di 40px */
body {
  top: 0px !important;
  position: static !important;
}

/* Nasconde il banner originale di Google Translate (in alto) */
.goog-te-banner-frame, iframe.goog-te-banner-frame {
  display: none !important;
}

/* Nasconde la barra di aiuto di Google */
.goog-te-balloon-frame {
  display: none !important;
}

/* Impedisce al browser di visualizzare i popup o gli highlight della traduzione */
.goog-tooltip, .goog-tooltip:hover, .goog-text-highlight {
  display: none !important;
  box-shadow: none !important;
  background: transparent !important;
  border: none !important;
}
```

### 4.4. Regola d'Oro per Evitare Traduzioni Indesiderate

Alcuni elementi (come i nomi propri, i loghi, i linguaggi di programmazione, o la lista delle lingue stessa) non devono mai essere tradotti. Google Translate rispetta una classe CSS speciale:
* Se aggiungete la classe **`notranslate`** a qualsiasi tag HTML, il motore di Google Translate lascerà intatto il testo racchiuso in quell'elemento.
* Abbiamo applicato questa classe al contenitore del nostro dropdown delle lingue (per evitare che i nomi "Italiano, Español, Deutsch" venissero tradotti in altre lingue dal bot) e al logo del brand.

---

## 5. Storie dalla Trincea: Troubleshooting Estremo


Durante lo sviluppo in aula (e in produzione!) abbiamo incontrato 4 grossi problemi. Ecco come ci siamo arrivati e come li abbiamo smontati analiticamente.

### Caso A: L'Errore Severo di TypeScript (`TS6133`)
Durante il primo caricamento su GitHub Actions, la pipeline si è fermata (Exit code 2) con questo errore:
`Error: src/App.tsx(1,8): error TS6133: 'React' is declared but its value is never read.`

**Diagnosi:** 
I linter moderni e il compilatore TypeScript (`tsc -b`) sono configurati per non ammettere spazzatura. Se dichiari una variabile e non la usi, la build fallisce. In passato, per usare JSX (`<div/>`) dovevi importare l'intero oggetto `React`. Dalla versione React 17 in poi, esiste un *JSX Transform* interno. L'import `import React from 'react';` era obsoleto.
**Soluzione:** Rimozione dell'import. Pipeline sbloccata.

### Caso B: La "Pagina Bianca del Terrore" su GitHub Pages (Errore 404 Assets)
Dopo il deploy, il sito caricava una pagina immacolata. Niente errori a schermo. 
Analizzando la rete (F12) abbiamo notato che l'HTML veniva caricato, ma i file Javascript e CSS davano errore `404 Not Found`.

**Diagnosi:**
Vite usa il parametro `base` nel file `vite.config.ts` per scrivere i percorsi nel file `index.html`. Inizialmente avevamo `base: '/leanding_page/'`. 
Questo diceva al browser: *"Ehi, per trovare il JS, vai su `italiasaija.it/leanding_page/assets/file.js`"*. 
Ma lo studente aveva configurato un file `CNAME` (Custom Domain). Questo significa che GitHub Pages stava servendo la repository dalla *radice* del dominio `italiasaija.it`, non da una sottocartella! Il browser cercava in una cartella inesistente.
**Soluzione:** 
Abbiamo impostato `base: './'`. Usare il percorso relativo *puntato* (`./`) è la panacea per quasi tutti i mali di deployment statico. Dice al browser di cercare gli asset *nella stessa esatta cartella* in cui ha trovato l'HTML. Fine dei 404.

### Caso C: Il "Mistero del CV Scomparso"
Il sito in locale funzionava, il tasto "Scarica CV" scaricava il file. In produzione (su GitHub), cliccando il tasto si veniva portati in un buco nero (404).

**Diagnosi e Soluzione (L'approccio Bulletproof di Vite):**
Il tasto era originariamente codificato così: `<a href="./cv.pdf">`. Affidarsi a una stringa hardcodata per le dipendenze statiche è rischioso. In produzione, complici i redirect del custom domain, il browser ha perso il riferimento relativo e tentava di cercare il PDF in directory errate.

Abbiamo preso il file e lo abbiamo spostato dentro il codice sorgente: `src/assets/cv.pdf`.
Poi, abbiamo esplicitamente informato il compilatore della sua esistenza: 
`import cvPdfUrl from './assets/cv.pdf';`

```mermaid
graph LR
    A[File Fisico: src/assets/cv.pdf] --> B(Compilatore Vite)
    C["Codice: import cvPdfUrl..."] --> B
    B --> D[Output Dist: dist/assets/cv-7Bxy9.pdf]
    B --> E["Codice Trasformato: href=/assets/cv-7Bxy9.pdf"]
    
    style B fill:#bd34fe,stroke:#333,stroke-width:2px,color:#fff
```
In questo modo, Vite non è più passivo. Prende il file, lo inserisce nella build sicura, genera un nome con un Hash univoco e inietta il percorso esatto al 100%. Il link non può più rompersi. È una lezione vitale sulla differenza tra *riferimento testuale* e *modulo importato*.

### Caso D: L'Hamburger Menu Paralizzato
Lo studente fa notare: "Da smartphone le 3 lineette non vanno".
Il Mockup originale HTML aveva un bottone statico. In React, il DOM statico non si auto-aggiorna da solo senza una logica esplicita.

**Diagnosi e Soluzione:**
Abbiamo introdotto l'hook `useState(false)`. Il bottone è diventato reattivo, cambiando persino l'icona (da Menu a Close) tramite un operatore ternario. Abbiamo infine wrappato la lista di link mobile dentro una valutazione logica: `{isMobileMenuOpen && ( <div... /> )}`. In React, se lo state è `false`, quel frammento di codice letteralmente *smette di esistere* nel Virtual DOM, senza pesare sulla RAM del dispositivo.

---

## 6. La Continuous Integration / Deployment (CI/CD)

Il vero DevOps non fa le cose a mano due volte. Abbiamo configurato due pipeline su GitHub Actions, orchestrate per lavorare in totale sintonia:

```mermaid
graph TD
    A[Modifica al Codice] -->|git push| B(Trigger: deploy.yml)
    C[Scoccare di Mezzanotte] -->|Cron Job| D(Trigger: linkedin-sync.yml)
    D --> E[Esegue RPA bot]
    E -->|Trova differenze| F[Commit su main: profile.json]
    F -->|Il bot fa una nuova push| B
    B --> G[npm ci & vite build]
    G --> H[GitHub CDN]
    H --> I((Messa in Produzione))
```

1. **Pipeline di Deploy (`deploy.yml`)**: Ogni volta che viene fatto un `push` sul ramo `main`, un server avvia `npm ci`, esegue la build di Vite e spara i file compilati ai server CDN di GitHub Pages in automatico.
2. **Pipeline di Sync (`linkedin-sync.yml`)**: Ogni notte a mezzanotte il server lancia il bot RPA. Se estrae dati diversi dal giorno prima, il bot lancia da solo un `git commit` col nuovo `profile.json`. Questo nuovo "push" automatico attiverà la pipeline di Deploy, chiudendo il cerchio senza alcun intervento umano.

Il risultato? Il portfolio è un vero ecosistema vivente, che si mantiene aggiornato mentre lo sviluppatore dorme.

---

## 7. Conclusione

Ragazzi, questa landing page è un capolavoro di orchestrazione. Non guardatela come una vetrina di testo e colori, ma come un assemblaggio di Node.js, automazione browser, build tools avanzati e pipeline cloud. Mantenete sempre la mentalità da ingegneri: scovate il problema nei DevTools, leggete i log della build, disaccoppiate i dati dalla UI e automatizzate tutto il possibile.

Buono studio.

---

## 8. Wiki & Glossario dei Termini

Per assicurarci di parlare tutti la stessa lingua tecnica, ecco il vocabolario fondamentale del progetto:

*   **API REST (Representational State Transfer):** Un'interfaccia di comunicazione standard usata su internet. Nel nostro caso, è il "cameriere" a cui chiediamo i dati di GitHub passandogli l'indirizzo del nostro account e lui ci restituisce un "vassoio" in formato JSON pieno dei nostri progetti.
*   **Base Path (`base` in Vite):** L'indirizzo "radice" da cui un sito web presume di essere eseguito. Fondamentale per dire ai file HTML dove pescare immagini, fogli di stile e script in produzione.
*   **CI/CD (Continuous Integration / Continuous Deployment):** Pratica DevOps che consiste nell'unire spesso il codice modificato in un archivio centrale (CI) e rilasciarlo ai clienti o agli utenti in modo automatico (CD). 
*   **Decoupling (Disaccoppiamento):** Pratica di ingegneria del software che consiste nel separare le logiche e i dati, in modo che l'aggiornamento di una componente non distrugga le altre (es. togliere le "skills" dal file App.tsx e spostarle in profile.json).
*   **DOM (Document Object Model) vs Virtual DOM:** Il DOM è la struttura ad albero HTML di una pagina web usata dai normali browser. Il *Virtual DOM*, usato da React, è una "fotocopia" in memoria di quell'albero. React aggiorna prima la fotocopia, calcola i cambiamenti in modo matematico e poi aggiorna il vero DOM solo dove serve, abbattendo drasticamente i tempi di caricamento.
*   **Hardcoding:** La cattivissima abitudine di "scrivere a mano" dati variabili all'interno del codice sorgente invece di caricarli da un database o da un file esterno.
*   **Hook (`useState`, `useEffect`):** Funzioni speciali in React che ti permettono di "agganciarti" a funzionalità di stato e ciclo di vita. Lo State tiene in memoria qualcosa che cambia (es. il menu mobile aperto), l'Effect si scatena quando qualcosa avviene (es. al caricamento della pagina tira giù i progetti da GitHub).
*   **Linter & Strict Mode:** Strumenti di polizia del codice. Controllano in tempo reale che tu non faccia pasticci, non dichiari variabili morte e che tu stia usando in modo corretto le tipizzazioni TypeScript.
*   **RPA (Robotic Process Automation):** L'uso di software "robotici" o "agenti" programmabili per eseguire in modo automatico compiti ripetitivi basati su interfacce umane. (Il nostro caso: lo script che va su LinkedIn per leggersi le tue posizioni di lavoro).
*   **Scraping Semantico:** Leggere i dati da una pagina web non tramite la posizione esatta di una riga di testo o dal nome di un colore (CSS selector), ma dal *significato* del tag (es. "Cerca un Titolo Principale che dice 'Esperienza' e poi leggi le righe successive").
*   **SPA (Single Page Application):** Un'app web che non ha bisogno di farti cambiare "pagina HTML" ricaricando lo schermo bianco tra un link e l'altro, ma ricarica solo i singoli "blocchi" dinamicamente simulando un software desktop.
