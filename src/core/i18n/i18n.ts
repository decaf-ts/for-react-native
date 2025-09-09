import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "@/assets/i18n/en.json";
import pt from "@/assets/i18n/pt.json";

i18n.use(initReactI18next).init({
	lng: "en",
	fallbackLng: "en",
	resources: {
		en: { translation: en },
		pt: { translation: pt },
	},
	interpolation: {
		escapeValue: false,
	},
});

export default i18n;
