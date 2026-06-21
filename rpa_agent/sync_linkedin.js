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
