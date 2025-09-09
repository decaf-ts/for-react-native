import i18n from "../i18n/i18n";
import { useEffect, useState } from "react";

export type SupportedLocales = "en" | "pt";
export type LocaleValue = string | Record<string, string>;
export type LocaleDictionary = Record<string, LocaleValue>;

export interface ILocaleService {
	get(key: string): string;
	changeLanguage(lang: SupportedLocales): Promise<void>;
	getCurrentLanguage(): SupportedLocales;
	getAvailableLanguages(): SupportedLocales[];
	setFallbackLanguage(language: SupportedLocales): void;
	getTranslations(lang: SupportedLocales): LocaleDictionary;
	setCurrentLocaleKey(key: SupportedLocales): void;
	subscribe(callback: () => void): void;
	unsubscribe(callback: () => void): void;
}

class TranslateServiceImpl implements ILocaleService {
	get(key: string): string {
		return i18n.t(key);
	}

	async changeLanguage(lang: SupportedLocales) {
		await i18n.changeLanguage(lang);
	}

	getCurrentLanguage(): SupportedLocales {
		return i18n.language as SupportedLocales;
	}

	getAvailableLanguages(): SupportedLocales[] {
		return Object.keys(i18n.options.resources || {}) as SupportedLocales[];
	}

	setFallbackLanguage(lang: SupportedLocales) {
		i18n.options.fallbackLng = lang;
	}

	getTranslations(lang: SupportedLocales): LocaleDictionary {
		return (i18n.options.resources?.[lang]?.translation || {}) as LocaleDictionary;
	}

	setCurrentLocaleKey(key: SupportedLocales) {
		i18n.changeLanguage(key);
	}

	subscribe(callback: () => void) {
		i18n.on("languageChanged", callback);
	}

	unsubscribe(callback: () => void) {
		i18n.off("languageChanged", callback);
	}
}

export const TranslateService = new TranslateServiceImpl();

export function useTranslate(key: string) {
	const [text, setText] = useState(() => TranslateService.get(key));

	useEffect(() => {
		const update = () => setText(TranslateService.get(key));

		update();
		TranslateService.subscribe(update);

		return () => TranslateService.unsubscribe(update);
	}, [key]);

	return text;
}
