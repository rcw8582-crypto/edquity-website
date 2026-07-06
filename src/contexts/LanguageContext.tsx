import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Lang = "en" | "es";

interface LanguageContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  setLang: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");

  // Keep the document language in sync with the active UI language so that
  // assistive technology (screen readers, translation tools) announces the
  // page in the correct language. WCAG 2.1 SC 3.1.1 / 3.1.2.
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
