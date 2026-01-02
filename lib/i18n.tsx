"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

type Language = "en" | "tr"

interface Translations {
  [key: string]: {
    en: string
    tr: string
  }
}

// Translation strings
const translations: Translations = {
  // Navigation
  "nav.about": { en: "About", tr: "Hakkımda" },
  "nav.portfolio": { en: "Portfolio", tr: "Portföy" },
  "nav.gallery": { en: "Gallery", tr: "Galeri" },
  "nav.blog": { en: "Blog", tr: "Blog" },
  "nav.contact": { en: "Contact", tr: "İletişim" },
  "nav.resume": { en: "Resume", tr: "CV" },
  
  // Hero
  "hero.greeting": { en: "Hi, I'm", tr: "Merhaba, ben" },
  "hero.title": { en: "Photography & Creative Portfolio", tr: "Fotoğraf & Yaratıcı Portföy" },
  "hero.subtitle": { 
    en: "Amateur photographer and curious explorer. Architecture, street photography, and everything that catches my eye.", 
    tr: "Amatör fotoğrafçı ve meraklı kaşif. Mimari, sokak fotoğrafçılığı ve gözüme takılan her şey." 
  },
  "hero.viewWork": { en: "View my work", tr: "Çalışmalarımı gör" },
  "hero.getInTouch": { en: "Get in touch", tr: "İletişime geç" },
  
  // About
  "about.title": { en: "About Me", tr: "Hakkımda" },
  "about.location": { en: "Istanbul, Turkey", tr: "İstanbul, Türkiye" },
  "about.role": { en: "Photographer & Engineer", tr: "Fotoğrafçı & Mühendis" },
  
  // Blog
  "blog.title": { en: "Thoughts & Stories", tr: "Düşünceler & Hikayeler" },
  "blog.subtitle": { 
    en: "New discoveries, projects, photography, and thoughts along the way.", 
    tr: "Yeni keşifler, projeler, fotoğraflar ve yoldaki düşünceler." 
  },
  "blog.readMore": { en: "Read more", tr: "Devamını oku" },
  "blog.minRead": { en: "min read", tr: "dk okuma" },
  "blog.featured": { en: "Featured", tr: "Öne Çıkan" },
  "blog.allPosts": { en: "All Posts", tr: "Tüm Yazılar" },
  "blog.backToBlog": { en: "Back to Blog", tr: "Bloga Dön" },
  "blog.relatedPosts": { en: "Related Posts", tr: "İlgili Yazılar" },
  "blog.share": { en: "Share", tr: "Paylaş" },
  "blog.save": { en: "Save for later", tr: "Sonra oku" },
  "blog.saved": { en: "Saved", tr: "Kaydedildi" },
  
  // Gallery
  "gallery.title": { en: "Gallery", tr: "Galeri" },
  "gallery.subtitle": { 
    en: "A curated collection of photographs from various projects and explorations.", 
    tr: "Çeşitli projeler ve keşiflerden seçilmiş fotoğraf koleksiyonu." 
  },
  "gallery.viewAll": { en: "View All", tr: "Tümünü Gör" },
  "gallery.filter": { en: "Filter", tr: "Filtrele" },
  
  // Portfolio
  "portfolio.title": { en: "Portfolio", tr: "Portföy" },
  "portfolio.subtitle": { 
    en: "A curated collection exploring architecture, electronics, and photography.", 
    tr: "Mimari, elektronik ve fotoğrafçılık keşfeden seçkin bir koleksiyon." 
  },
  "portfolio.viewProject": { en: "View Project", tr: "Projeyi Gör" },
  "portfolio.allWork": { en: "All Work", tr: "Tüm Çalışmalar" },
  
  // Contact
  "contact.title": { en: "Let's work together", tr: "Birlikte çalışalım" },
  "contact.subtitle": { 
    en: "Interested in a commission, collaboration, or just want to say hello?", 
    tr: "Bir proje, işbirliği veya sadece merhaba demek ister misiniz?" 
  },
  "contact.email": { en: "Email", tr: "E-posta" },
  "contact.social": { en: "Social", tr: "Sosyal" },
  "contact.location": { en: "Based in", tr: "Konum" },
  "contact.name": { en: "Name", tr: "İsim" },
  "contact.message": { en: "Message", tr: "Mesaj" },
  "contact.send": { en: "Send Message", tr: "Mesaj Gönder" },
  "contact.sending": { en: "Sending...", tr: "Gönderiliyor..." },
  
  // Footer
  "footer.cta": { en: "Let's create something together", tr: "Birlikte bir şeyler yaratalım" },
  "footer.rights": { en: "All rights reserved.", tr: "Tüm hakları saklıdır." },
  "footer.backToTop": { en: "Back to top", tr: "Yukarı dön" },
  
  // Common
  "common.readingList": { en: "Reading List", tr: "Okuma Listesi" },
  "common.search": { en: "Search", tr: "Ara" },
  "common.noResults": { en: "No results found", tr: "Sonuç bulunamadı" },
  "common.loading": { en: "Loading...", tr: "Yükleniyor..." },
  "common.error": { en: "Something went wrong", tr: "Bir hata oluştu" },
  "common.viewAll": { en: "View All", tr: "Tümünü Gör" },
  "common.close": { en: "Close", tr: "Kapat" },
  
  // Theme
  "theme.light": { en: "Light", tr: "Açık" },
  "theme.dark": { en: "Dark", tr: "Koyu" },
  "theme.accent": { en: "Accent Color", tr: "Vurgu Rengi" },
}

interface I18nContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Check localStorage or browser language
    const savedLang = localStorage.getItem("language") as Language
    if (savedLang && (savedLang === "en" || savedLang === "tr")) {
      setLanguageState(savedLang)
    } else {
      // Check browser language
      const browserLang = navigator.language.toLowerCase()
      if (browserLang.startsWith("tr")) {
        setLanguageState("tr")
      }
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem("language", lang)
    document.documentElement.lang = lang
  }

  const t = (key: string): string => {
    const translation = translations[key]
    if (!translation) {
      console.warn(`Translation missing for key: ${key}`)
      return key
    }
    return translation[language]
  }

  if (!mounted) {
    return <>{children}</>
  }

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider")
  }
  return context
}

// Language Switcher Component
export function LanguageSwitcher({ className }: { className?: string }) {
  const { language, setLanguage } = useI18n()

  return (
    <button
      onClick={() => setLanguage(language === "en" ? "tr" : "en")}
      className={`flex items-center gap-1.5 px-2 py-1 text-sm font-mono text-muted-foreground hover:text-foreground transition-colors ${className}`}
      aria-label={`Switch to ${language === "en" ? "Turkish" : "English"}`}
    >
      <span className={language === "en" ? "text-foreground" : ""}>EN</span>
      <span className="text-muted-foreground/50">/</span>
      <span className={language === "tr" ? "text-foreground" : ""}>TR</span>
    </button>
  )
}
