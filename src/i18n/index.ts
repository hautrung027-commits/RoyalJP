import i18n from 'i18next';
import { initReactI18next, useTranslation } from 'react-i18next';
import jaTranslation from '../locales/ja.json';
import viTranslation from '../locales/vi.json';

export type LanguageCode = 'ja' | 'vi';

const STORAGE_KEY = 'luxe_language';

// Get initial language: Default to 'ja' if not set
export const getInitialLanguage = (): LanguageCode => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'vi' || saved === 'ja') {
      return saved;
    }
  } catch {
    // Ignore localStorage error
  }
  return 'ja'; // Default language is Japanese
};

const initialLang = getInitialLanguage();

i18n
  .use(initReactI18next)
  .init({
    resources: {
      ja: { translation: jaTranslation },
      vi: { translation: viTranslation },
    },
    lng: initialLang,
    fallbackLng: 'ja',
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  });

// Apply document HTML lang attribute and SEO meta tags
export const applyDocumentLanguage = (lang: LanguageCode) => {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lang;
    
    // Update title and meta description dynamically
    if (lang === 'ja') {
      document.title = 'royalJPcar - 至高のラグジュアリーカー・ショールーム (六本木・東京)';
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', '東京・六本木の最高峰スーパーカー＆ラグジュアリーカーショールーム「royalJPcar」。正規通関保証付きの極上車と上質なおもてなしをご提供します。');
      }
    } else {
      document.title = 'royalJPcar Japan - Showroom Siêu Xe & Xe Hạng Sang Tại Tokyo';
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', 'royalJPcar - Showroom ô tô hạng sang và siêu xe hàng đầu tại Tokyo, Nhật Bản. Hỗ trợ song ngữ Nhật - Việt, dịch vụ chuẩn VIP.');
      }
    }
  }
};

// Immediately apply initial lang
applyDocumentLanguage(initialLang);

// Listen to i18n language change to persist and update HTML
i18n.on('languageChanged', (lng) => {
  const lang = (lng === 'vi' ? 'vi' : 'ja') as LanguageCode;
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    // Ignore error
  }
  applyDocumentLanguage(lang);
});

export const changeLanguage = (lang: LanguageCode) => {
  i18n.changeLanguage(lang);
};

export default i18n;
