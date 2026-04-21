import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  en: {
    translation: {
      app: { name: "AlleNest AI", tagline: "Nature's Gentle Embrace" },
      common: {
        start: "Get Started", save: "Save", cancel: "Cancel", next: "Next",
        back: "Back", add: "Add", edit: "Edit", delete: "Delete", search: "Search...",
        loading: "Loading...", today: "Today", yesterday: "Yesterday",
      },
      lang: { choose: "Choose your language", subtitle: "Smart care for your little one" },
      onboarding: {
        title: "Smart care for your little one,",
        title2: "peace of mind for you.",
        desc: "AI-powered allergy tracking and pediatric safety companion built with love.",
      },
      profile: {
        title: "Child Profile", name: "Child name", birthdate: "Birth date",
        gender: "Gender", male: "Boy", female: "Girl", feeding: "Feeding type",
        breast: "Breastfeeding", formula: "Formula", mixed: "Mixed", solid: "Solid food",
        allergies: "Known allergies", saveProfile: "Save & Continue",
      },
      home: {
        greeting: "Hello mama 👋", subtitle: "How is your baby today?",
        searchPh: "Search food, symptom, advice...",
        track: "Track Symptoms", insights: "AI Insights",
        emergency: "Emergency", advice: "Advice Center",
        recent: "Recent activity", noActivity: "No activity yet — start tracking",
      },
      track: {
        title: "Log food & symptoms", food: "Food", symptom: "Symptom",
        severity: "Severity", low: "Low", med: "Medium", high: "High",
        notes: "Notes", notesPh: "Write your notes here...",
        time: "Time", saveEntry: "Save entry",
        symptoms: {
          rash: "Skin rash", itch: "Itching", diarrhea: "Diarrhea",
          cough: "Cough", swelling: "Swelling", breath: "Breathing trouble",
        },
      },
      insights: {
        title: "AI Insights", risk: "Risk level", high: "High", med: "Medium", low: "Low",
        cause: "Likely cause", pattern: "Recurring pattern detected", yes: "Yes", no: "No",
        confidence: "Confidence rate", correlation: "Food ↔ symptom correlation",
        advice: "Try avoiding eggs temporarily and consult your doctor.",
      },
      timeline: { title: "Timeline", empty: "Your timeline will appear here" },
      emergency: {
        title: "Emergency", urgent: "Critical situation?",
        sub: "Act fast, we're here to help you.",
        signs: "Severe symptoms",
        s1: "Difficulty breathing", s2: "Face or lip swelling", s3: "Loss of consciousness",
        call: "Call emergency 14", aid: "First aid", aidText: "Lay your child in a comfortable position and head immediately to the nearest hospital.",
      },
      adviceC: {
        title: "Advice Center",
        a1: "Food introduction guide", a1d: "Safely introducing new foods step by step",
        a2: "Allergy prevention", a2d: "Practical tips to protect your child",
        a3: "Warning signs", a3d: "When to worry and call the doctor",
      },
      doctor: {
        title: "Doctor follow-up", visits: "Medical visits", prescriptions: "Prescriptions",
        notes: "Doctor notes", addVisit: "Add new visit", with: "with",
      },
      settings: {
        title: "Settings", language: "Language", dark: "Dark mode",
        voice: "Kid voice feedback", sound: "Sound", largeText: "Large text",
        contrast: "High contrast", about: "About app", privacy: "Privacy policy",
      },
      tabs: { home: "Home", timeline: "Timeline", insights: "Insights", advice: "Advice", settings: "Settings" },
    },
  },
  fr: {
    translation: {
      app: { name: "AlleNest AI", tagline: "La douce étreinte de la nature" },
      common: {
        start: "Commencer", save: "Enregistrer", cancel: "Annuler", next: "Suivant",
        back: "Retour", add: "Ajouter", edit: "Modifier", delete: "Supprimer", search: "Rechercher...",
        loading: "Chargement...", today: "Aujourd'hui", yesterday: "Hier",
      },
      lang: { choose: "Choisissez votre langue", subtitle: "Soins intelligents pour votre tout-petit" },
      onboarding: {
        title: "Soins intelligents pour votre bébé,",
        title2: "tranquillité pour vous.",
        desc: "Suivi des allergies par IA et compagnon de sécurité pédiatrique fait avec amour.",
      },
      profile: {
        title: "Profil de l'enfant", name: "Nom de l'enfant", birthdate: "Date de naissance",
        gender: "Genre", male: "Garçon", female: "Fille", feeding: "Type d'alimentation",
        breast: "Allaitement", formula: "Lait artificiel", mixed: "Mixte", solid: "Solide",
        allergies: "Allergies connues", saveProfile: "Enregistrer & continuer",
      },
      home: {
        greeting: "Bonjour maman 👋", subtitle: "Comment va bébé aujourd'hui ?",
        searchPh: "Aliment, symptôme, conseil...",
        track: "Suivre symptômes", insights: "Analyses IA",
        emergency: "Urgence", advice: "Conseils",
        recent: "Activité récente", noActivity: "Aucune activité — commencez le suivi",
      },
      track: {
        title: "Aliments & symptômes", food: "Aliment", symptom: "Symptôme",
        severity: "Sévérité", low: "Faible", med: "Moyen", high: "Élevé",
        notes: "Notes", notesPh: "Écrivez vos notes ici...",
        time: "Heure", saveEntry: "Enregistrer",
        symptoms: {
          rash: "Éruption cutanée", itch: "Démangeaisons", diarrhea: "Diarrhée",
          cough: "Toux", swelling: "Gonflement", breath: "Difficulté respiratoire",
        },
      },
      insights: {
        title: "Analyses IA", risk: "Niveau de risque", high: "Élevé", med: "Moyen", low: "Faible",
        cause: "Cause probable", pattern: "Schéma répétitif détecté", yes: "Oui", no: "Non",
        confidence: "Taux de confiance", correlation: "Corrélation aliment ↔ symptôme",
        advice: "Essayez d'éviter les œufs temporairement et consultez votre médecin.",
      },
      timeline: { title: "Chronologie", empty: "Votre historique apparaîtra ici" },
      emergency: {
        title: "Urgence", urgent: "Situation critique ?",
        sub: "Agissez vite, nous sommes là.",
        signs: "Symptômes graves",
        s1: "Difficulté à respirer", s2: "Gonflement visage/lèvres", s3: "Perte de conscience",
        call: "Appeler urgence 14", aid: "Premiers secours", aidText: "Allongez votre enfant confortablement et rendez-vous immédiatement à l'hôpital.",
      },
      adviceC: {
        title: "Centre de conseils",
        a1: "Introduction des aliments", a1d: "Introduire les aliments en toute sécurité",
        a2: "Prévention des allergies", a2d: "Conseils pratiques pour protéger votre enfant",
        a3: "Signes d'alerte", a3d: "Quand s'inquiéter et appeler le médecin",
      },
      doctor: {
        title: "Suivi médical", visits: "Visites médicales", prescriptions: "Ordonnances",
        notes: "Notes du médecin", addVisit: "Nouvelle visite", with: "avec",
      },
      settings: {
        title: "Paramètres", language: "Langue", dark: "Mode sombre",
        voice: "Voix pour enfant", sound: "Son", largeText: "Grand texte",
        contrast: "Contraste élevé", about: "À propos", privacy: "Confidentialité",
      },
      tabs: { home: "Accueil", timeline: "Historique", insights: "Analyses", advice: "Conseils", settings: "Réglages" },
    },
  },
  ar: {
    translation: {
      app: { name: "آل نيست", tagline: "حضن الطبيعة الحنون" },
      common: {
        start: "ابدأ الآن", save: "حفظ", cancel: "إلغاء", next: "التالي",
        back: "رجوع", add: "إضافة", edit: "تعديل", delete: "حذف", search: "ابحث...",
        loading: "جارٍ التحميل...", today: "اليوم", yesterday: "أمس",
      },
      lang: { choose: "اختر لغتك", subtitle: "رعاية ذكية لطفلك الصغير" },
      onboarding: {
        title: "رعاية ذكية لطفلك،",
        title2: "وراحة بال لك.",
        desc: "تتبّع الحساسية بالذكاء الاصطناعي ورفيق الأمان الصحي لطفلك.",
      },
      profile: {
        title: "معلومات الطفل", name: "اسم الطفل", birthdate: "تاريخ الميلاد",
        gender: "الجنس", male: "ذكر", female: "أنثى", feeding: "نوع التغذية",
        breast: "رضاعة طبيعية", formula: "حليب صناعي", mixed: "مختلط", solid: "طعام صلب",
        allergies: "الحساسية المعروفة", saveProfile: "حفظ ومتابعة",
      },
      home: {
        greeting: "مرحبا ماما 👋", subtitle: "كيف حال طفلك اليوم؟",
        searchPh: "ابحث عن طعام، عرض، نصيحة...",
        track: "تسجيل الأعراض", insights: "تحليلات الذكاء",
        emergency: "طوارئ", advice: "مركز النصائح",
        recent: "آخر النشاطات", noActivity: "لا توجد بيانات بعد",
      },
      track: {
        title: "تسجيل الطعام والعرض", food: "طعام", symptom: "عرض",
        severity: "شدة العرض", low: "خفيف", med: "متوسط", high: "شديد",
        notes: "ملاحظات", notesPh: "اكتب ملاحظاتك هنا...",
        time: "الوقت", saveEntry: "حفظ",
        symptoms: {
          rash: "طفح جلدي", itch: "حكة", diarrhea: "إسهال",
          cough: "سعال", swelling: "تورم", breath: "صعوبة تنفس",
        },
      },
      insights: {
        title: "تحليلات الذكاء", risk: "مستوى الخطر", high: "مرتفع", med: "متوسط", low: "منخفض",
        cause: "السبب المحتمل", pattern: "تم اكتشاف نمط متكرر", yes: "نعم", no: "لا",
        confidence: "معدل الثقة", correlation: "العلاقة بين الطعام والأعراض",
        advice: "حاول تجنب البيض مؤقتًا واستشر الطبيب.",
      },
      timeline: { title: "الخط الزمني", empty: "سيظهر سجلك هنا" },
      emergency: {
        title: "طوارئ", urgent: "حالة طارئة؟",
        sub: "تحرك بسرعة، نحن هنا لمساعدتك.",
        signs: "أعراض خطيرة",
        s1: "صعوبة في التنفس", s2: "تورم الوجه أو الشفاه", s3: "فقدان الوعي",
        call: "اتصل بالإسعاف 14", aid: "الإسعافات الأولية",
        aidText: "أبقِ الطفل في وضعية مريحة وتوجه فورًا لأقرب مستشفى.",
      },
      adviceC: {
        title: "مركز النصائح",
        a1: "مقدمة الأطعمة", a1d: "دليل إدخال الأطعمة لطفلك بأمان",
        a2: "الوقاية من الحساسية", a2d: "نصائح عملية لحماية طفلك",
        a3: "علامات التحذير", a3d: "متى يجب القلق والتوجه للطبيب",
      },
      doctor: {
        title: "متابعة الطبيب", visits: "الزيارات الطبية", prescriptions: "الوصفات",
        notes: "ملاحظات الطبيب", addVisit: "إضافة زيارة جديدة", with: "مع",
      },
      settings: {
        title: "الإعدادات", language: "اللغة", dark: "الوضع الليلي",
        voice: "الصوت للأطفال", sound: "الصوت", largeText: "النص الكبير",
        contrast: "وضع التباين العالي", about: "حول التطبيق", privacy: "سياسة الخصوصية",
      },
      tabs: { home: "الرئيسية", timeline: "الخط الزمني", insights: "تحليلات", advice: "النصائح", settings: "الإعدادات" },
    },
  },
};

if (!i18n.isInitialized) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: "en",
      supportedLngs: ["en", "fr", "ar"],
      interpolation: { escapeValue: false },
      detection: { order: ["localStorage", "navigator"], caches: ["localStorage"] },
    });
}

export const setLanguage = (lng: "en" | "fr" | "ar") => {
  i18n.changeLanguage(lng);
  if (typeof document !== "undefined") {
    document.documentElement.lang = lng;
    document.documentElement.dir = lng === "ar" ? "rtl" : "ltr";
  }
};

export default i18n;
