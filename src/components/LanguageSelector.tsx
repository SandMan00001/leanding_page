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
  { code: 'hy', name: 'Հայերեն (Armeno)', flag: '🇦🇲' },
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

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Initialize Google Translate Script and check cookie
  useEffect(() => {
    // Read cookie to set initial active language
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

    // Inject Google Translate script dynamically if not already present
    if (!document.getElementById('google-translate-script')) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    }

    // Set callback function on window
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
    
    // Clear cookies for path / and various domain configurations
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
      // Set new cookie
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
          setSearchQuery(''); // Reset search query on toggle
        }}
        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-container-high/40 hover:bg-surface-container-high/70 border border-surface-stroke backdrop-blur-md text-on-surface hover:text-white transition-all duration-300 font-label-caps text-label-caps cursor-pointer shadow-sm"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <Globe className="w-4 h-4 text-primary shrink-0 animate-pulse" />
        <span>{activeLanguage.flag} {activeLanguage.name}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-text-muted transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-56 rounded-lg bg-surface-container/95 border border-surface-stroke backdrop-blur-md shadow-2xl z-[100] flex flex-col overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
          role="listbox"
        >
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
