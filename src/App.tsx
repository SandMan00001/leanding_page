import { useState, useEffect } from 'react';
import profileData from './data/profile.json';

interface Repo {
  id: number;
  name: string;
  html_url: string;
  description: string;
  language: string;
}

function App() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetch('https://api.github.com/users/SandMan00001/repos?sort=updated&per_page=6')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setRepos(data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching repos:', err);
        setLoading(false);
      });
  }, []);

  return (
    <>
      {/* Background Grid */}
      <div className="fixed inset-0 grid-bg pointer-events-none -z-10"></div>
      <div className="fixed inset-0 glow-overlay pointer-events-none -z-10"></div>

      {/* TopNavBar */}
      <div className="bg-gradient-to-r from-primary-container to-secondary-container text-white font-label-caps text-label-caps py-2.5 px-4 text-center relative z-[60] flex justify-center items-center gap-2 shadow-[0_4px_20px_rgba(0,115,206,0.2)]">
         <span className="material-symbols-outlined text-[16px]">rocket_launch</span>
         <span>
           Co-Founder di <a href="https://foundreams.it" target="_blank" rel="noopener noreferrer" className="font-bold underline hover:text-white/80 transition-colors ml-1">FounDreams.it</a> - Scopri la nostra Digital Agency
         </span>
      </div>
      <nav className="sticky top-0 w-full z-50 border-b border-surface-stroke bg-surface-dim/80 backdrop-blur-md">
        <div className="flex justify-between items-center max-w-container-max mx-auto px-gutter md:px-gutter px-margin-mobile h-20">
          <a className="font-headline-lg text-headline-lg tracking-tighter text-on-surface" href="#">Gabriele Saija</a>
          <div className="hidden md:flex gap-8 items-center font-label-caps text-label-caps">
            <a className="text-primary border-b-2 border-primary pb-1" href="#about">Chi sono</a>
            <a className="text-text-muted hover:text-on-surface transition-colors" href="#experience">Esperienza</a>
            <a className="text-text-muted hover:text-on-surface transition-colors" href="#projects">Progetti</a>
            <a className="text-text-muted hover:text-on-surface transition-colors" href="#skills">Competenze</a>
            <a className="text-text-muted hover:text-on-surface transition-colors" href="#contact">Contatti</a>
          </div>
          <a className="hidden md:inline-flex bg-primary-container text-white px-6 py-3 rounded hover:bg-opacity-90 transition-all font-label-caps text-label-caps items-center gap-2 border border-primary-container" href="mailto:gabriele.saija.2003@gmail.com">
            <span className="material-symbols-outlined text-[18px]">mail</span> Contattami
          </a>
          {/* Mobile Menu Button */}
          <button className="md:hidden text-on-surface p-2 focus:outline-none" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <span className="material-symbols-outlined">{isMobileMenuOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
        {/* Mobile Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-surface-dim border-b border-surface-stroke absolute w-full left-0 top-full flex flex-col font-label-caps text-label-caps shadow-lg pb-6">
            <a className="text-on-surface hover:bg-surface-elevated px-margin-mobile py-4 transition-colors border-b border-surface-stroke/50" href="#about" onClick={() => setIsMobileMenuOpen(false)}>Chi sono</a>
            <a className="text-text-muted hover:text-on-surface hover:bg-surface-elevated px-margin-mobile py-4 transition-colors border-b border-surface-stroke/50" href="#experience" onClick={() => setIsMobileMenuOpen(false)}>Esperienza</a>
            <a className="text-text-muted hover:text-on-surface hover:bg-surface-elevated px-margin-mobile py-4 transition-colors border-b border-surface-stroke/50" href="#projects" onClick={() => setIsMobileMenuOpen(false)}>Progetti</a>
            <a className="text-text-muted hover:text-on-surface hover:bg-surface-elevated px-margin-mobile py-4 transition-colors border-b border-surface-stroke/50" href="#skills" onClick={() => setIsMobileMenuOpen(false)}>Competenze</a>
            <a className="text-text-muted hover:text-on-surface hover:bg-surface-elevated px-margin-mobile py-4 transition-colors" href="#contact" onClick={() => setIsMobileMenuOpen(false)}>Contatti</a>
            <div className="px-margin-mobile pt-4">
              <a className="inline-flex bg-primary text-on-primary px-6 py-3 rounded hover:bg-opacity-90 transition-all items-center gap-2 justify-center w-full" href="mailto:gabriele.saija.2003@gmail.com">
                <span className="material-symbols-outlined text-[18px]">mail</span> Contattami
              </a>
            </div>
          </div>
        )}
      </nav>

      <main className="pt-12 md:pt-16 pb-section-gap">
        {/* Hero Section */}
        <section className="max-w-container-max mx-auto px-margin-mobile md:px-gutter py-section-gap flex flex-col md:flex-row items-center gap-16 relative">
          <div className="flex-1 space-y-8">
            <div className="inline-flex items-center gap-2 bg-surface-elevated border border-surface-stroke px-3 py-1.5 rounded-full font-label-caps text-label-caps text-secondary">
              <span className="material-symbols-outlined text-[16px]">security</span>
              Approccio Security-First
            </div>
            <h1 className="font-headline-xl text-headline-xl md:text-[64px] leading-tight text-on-surface">
              Security &amp; Cloud<br/>
              <span className="text-text-muted">Engineer | DevOps</span>
            </h1>
            <p className="font-body-md text-body-md text-text-muted max-w-xl text-lg">
              Systems Thinking e affidabilità Mission-Critical. Progettazione di infrastrutture resilienti e messa in sicurezza di ecosistemi digitali dalle fondamenta.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <a className="bg-primary-container text-white px-8 py-4 rounded font-label-caps text-label-caps hover:bg-opacity-90 transition-all flex items-center gap-2" href="#contact">
                Contattami <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </a>
              <a className="bg-transparent text-on-surface border border-surface-stroke px-8 py-4 rounded font-label-caps text-label-caps hover:bg-surface-elevated hover:border-outline transition-all" href="#experience">
                Vedi Esperienza
              </a>
            </div>
          </div>
          <div className="flex-1 w-full relative">
            {/* Profile Image */}
            <div className="aspect-square bg-surface-elevated border border-surface-stroke rounded-xl overflow-hidden relative group">
              <img src={`${import.meta.env.BASE_URL}profile.jpg`} alt="Gabriele Saija" className="w-full h-full object-cover" />
            </div>
          </div>
        </section>

        {/* About & Positioning Section */}
        <section className="max-w-container-max mx-auto px-margin-mobile md:px-gutter py-section-gap border-t border-surface-stroke" id="about">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            <div className="col-span-1 md:col-span-4">
              <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-4">Architettura e Mindset</h2>
              <p className="font-label-caps text-label-caps text-primary">01 / INIZIALIZZAZIONE</p>
            </div>
            <div className="col-span-1 md:col-span-8 space-y-12">
              <div className="prose prose-invert max-w-none font-body-md text-body-md text-text-muted space-y-6">
                <p className="text-xl text-on-surface">Spinto da una profonda curiosità tecnica fin dall'infanzia, il mio approccio all'ingegneria è radicato nella disciplina e nella comprensione sistemica.</p>
                <p>Sono specializzato nel tradurre sfide tecniche complesse in architetture solide e sicure. Un mio punto di forza è la capacità di comunicare questi concetti in modo chiaro, colmando il divario tra l'esecuzione tecnica approfondita e gli obiettivi di business più ampi.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-surface-elevated p-8 border border-surface-stroke rounded-lg">
                  <span className="material-symbols-outlined text-primary mb-4 text-[32px]">shield_lock</span>
                  <h3 className="font-headline-lg-mobile text-[20px] text-on-surface mb-2">Security-First</h3>
                  <p className="text-text-muted font-body-sm text-body-sm">Integrazione della sicurezza a livello architetturale, piuttosto che come ripensamento. Focus su conformità, threat modeling e progettazione resiliente.</p>
                </div>
                <div className="bg-surface-elevated p-8 border border-surface-stroke rounded-lg">
                  <span className="material-symbols-outlined text-primary mb-4 text-[32px]">memory</span>
                  <h3 className="font-headline-lg-mobile text-[20px] text-on-surface mb-2">Orientamento DevOps</h3>
                  <p className="text-text-muted font-body-sm text-body-sm">Automazione dell'infrastruttura, ottimizzazione delle pipeline CI/CD e garanzia di cicli di deployment senza interruzioni con una forte mentalità orientata al troubleshooting.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* GitHub Projects Section */}
        <section className="max-w-container-max mx-auto px-margin-mobile md:px-gutter py-section-gap border-t border-surface-stroke" id="projects">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            <div className="col-span-1 md:col-span-4">
              <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-4">Progetti Open Source</h2>
              <p className="font-label-caps text-label-caps text-primary">02 / GITHUB</p>
            </div>
            <div className="col-span-1 md:col-span-8">
              {loading ? (
                <div className="text-text-muted font-code-snippet animate-pulse">&gt; fetching_repos...</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {repos.map(repo => (
                    <div key={repo.id} className="bg-surface-elevated p-6 border border-surface-stroke rounded-lg flex flex-col h-full group hover:border-primary transition-colors">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-headline-lg-mobile text-[18px] text-on-surface group-hover:text-primary transition-colors">{repo.name}</h3>
                        <span className="material-symbols-outlined text-text-muted text-[20px]">code</span>
                      </div>
                      <p className="text-text-muted font-body-sm text-body-sm mb-6 flex-grow">
                        {repo.description || "Nessuna descrizione disponibile per questa repository."}
                      </p>
                      <div className="flex justify-between items-center mt-auto pt-4 border-t border-surface-stroke">
                        <span className="font-code-snippet text-code-snippet text-status-secure flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-status-secure"></span>
                          {repo.language || 'Multi'}
                        </span>
                        <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="font-label-caps text-label-caps text-on-surface hover:text-primary flex items-center gap-1 transition-colors">
                          VISITA <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section className="max-w-container-max mx-auto px-margin-mobile md:px-gutter py-section-gap border-t border-surface-stroke" id="skills">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            <div className="col-span-1 md:col-span-4">
              <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-4">Stack Tecnico</h2>
              <p className="font-label-caps text-label-caps text-primary">03 / COMPETENZE</p>
            </div>
            <div className="col-span-1 md:col-span-8">
              <div className="space-y-12">
                {/* Technical */}
                <div>
                  <h3 className="font-label-caps text-label-caps text-text-muted mb-6 border-b border-surface-stroke pb-2">INFRASTRUTTURA &amp; DEPLOYMENT</h3>
                  <div className="overflow-hidden w-full relative group mask-image-edges">
                    <div className="flex w-max animate-marquee gap-3 group-hover:[animation-play-state:paused]">
                      {[...profileData.skills.infrastructure, ...profileData.skills.infrastructure].map((skill, index) => (
                        <span key={index} className="bg-surface-elevated border border-surface-stroke px-4 py-2 rounded font-code-snippet text-code-snippet text-on-surface shrink-0">{skill}</span>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Security */}
                <div>
                  <h3 className="font-label-caps text-label-caps text-text-muted mb-6 border-b border-surface-stroke pb-2 mt-8">SICUREZZA &amp; COMPLIANCE</h3>
                  <div className="overflow-hidden w-full relative group mask-image-edges">
                    <div className="flex w-max animate-marquee-reverse gap-3 group-hover:[animation-play-state:paused]">
                      {[...profileData.skills.security, ...profileData.skills.security].map((skill, index) => (
                        <span key={index} className={`bg-surface-elevated border border-surface-stroke px-4 py-2 rounded font-code-snippet text-code-snippet shrink-0 ${index % profileData.skills.security.length === 0 ? 'text-status-secure flex items-center gap-2' : 'text-on-surface'}`}>
                          {index % profileData.skills.security.length === 0 && <span className="material-symbols-outlined text-[14px]">verified</span>}
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Experience & Education Section */}
        <section className="max-w-container-max mx-auto px-margin-mobile md:px-gutter py-section-gap border-t border-surface-stroke" id="experience">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            <div className="col-span-1 md:col-span-4">
              <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-4">Esperienze sul Campo</h2>
              <p className="font-label-caps text-label-caps text-primary">04 / DEPLOYMENT</p>
            </div>
            <div className="col-span-1 md:col-span-8 space-y-16">
              {/* Experience Timeline */}
              <div className="space-y-8 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-px before:bg-surface-stroke">
                {profileData.experience.map((job, index) => (
                  <div key={index} className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group ${index === 0 ? 'is-active' : ''}`}>
                    <div className={`flex items-center justify-center w-5 h-5 rounded-full bg-surface-dim border-2 ${index === 0 ? 'border-primary' : 'border-surface-stroke'} shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_0_0_4px_#131313] z-10`}></div>
                    <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] bg-surface-elevated border border-surface-stroke p-6 rounded-lg ml-6 md:ml-0">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-headline-lg-mobile text-[20px] text-on-surface">{job.role}</h3>
                        {job.duration && <span className="font-label-caps text-label-caps text-primary">{job.duration}</span>}
                      </div>
                      <p className="font-code-snippet text-code-snippet text-text-muted mb-4">@ {job.company}</p>
                      <p className="font-body-sm text-body-sm text-text-muted">{job.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              {/* Education */}
              <div className="mt-16 border-t border-surface-stroke pt-12">
                <h3 className="font-label-caps text-label-caps text-text-muted mb-8">FORMAZIONE ACCADEMICA</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-surface-container-low border-l-2 border-outline-variant p-6">
                    <h4 className="font-headline-lg-mobile text-[18px] text-on-surface mb-1">ITS Cloud &amp; Security</h4>
                    <p className="font-body-sm text-body-sm text-text-muted">Tech Talent Factory</p>
                  </div>
                  <div className="bg-surface-container-low border-l-2 border-outline-variant p-6">
                    <h4 className="font-headline-lg-mobile text-[18px] text-on-surface mb-1">Ingegneria Informatica</h4>
                    <p className="font-body-sm text-body-sm text-text-muted">Corso di Laurea</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="max-w-container-max mx-auto px-margin-mobile md:px-gutter py-section-gap border-t border-surface-stroke text-center" id="contact">
          <div className="max-w-2xl mx-auto space-y-8">
            <span className="material-symbols-outlined text-[48px] text-outline">terminal</span>
            <h2 className="font-headline-xl text-headline-xl text-on-surface">Entra in Contatto</h2>
            <p className="font-body-md text-body-md text-text-muted">
              Attualmente aperto a discussioni su ruoli legati a infrastrutture mission-critical e sicurezza. Residente a Vigevano(PV), Italia (23 anni), disponibile per collaborazioni da remoto o ibride.
            </p>
            <a className="inline-flex bg-primary text-on-primary px-8 py-4 rounded font-label-caps text-label-caps hover:bg-opacity-90 transition-all items-center gap-2" href="mailto:gabriele.saija.2003@gmail.com">
              <span className="material-symbols-outlined text-[18px]">mail</span> Contattami
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-section-gap border-t border-surface-stroke bg-surface-container-lowest">
        <div className="max-w-container-max mx-auto px-gutter flex flex-col md:flex-row justify-between items-center gap-base">
          <div className="font-headline-lg text-headline-lg text-on-surface text-[24px]">Gabriele Saija</div>
          <div className="flex gap-6 font-body-sm text-body-sm text-text-muted">
            <a className="hover:text-secondary-fixed transition-colors" href="#">Sicurezza</a>
            <a className="hover:text-secondary-fixed transition-colors" href="#">Infrastruttura</a>
            <a className="hover:text-secondary-fixed transition-colors" href="#">Informativa sulla Privacy</a>
          </div>
          <div className="font-body-sm text-body-sm text-text-muted">
            © 2024 Gabriele Saija. Progettato per l'affidabilità.
          </div>
        </div>
      </footer>
    </>
  );
}

export default App;
