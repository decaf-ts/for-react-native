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

/**
 * @description Provides translation services by wrapping and extending the i18n instance.
 * @summary This class implements the `ILocaleService` interface to manage translations, current language, available languages, subscriptions to language change events, and localized dictionaries. It acts as the central point for handling internationalization in the application.
 * @param {SupportedLocales} lang - The language code for supported locales.
 * @param {string} key - The translation key used to retrieve localized values.
 * @param {() => void} callback - A function to be executed when the language changes.
 * @return {void|Promise<void>|string|LocaleDictionary|SupportedLocales|SupportedLocales[]} Depending on the method called, return types vary accordingly.
 * @class
 * @example
 * ```ts
 * import { TranslateService } from "./TranslateService";
 *
 * // Get a translation by key
 * const welcomeMessage = TranslateService.get("welcome.message");
 *
 * // Change language to Portuguese
 * await TranslateService.changeLanguage("pt");
 *
 * // Subscribe to language changes
 * const callback = () => console.log("Language changed!");
 * TranslateService.subscribe(callback);
 *
 * // Unsubscribe later
 * TranslateService.unsubscribe(callback);
 * ```
 * @mermaid
 * sequenceDiagram
 *   participant Client
 *   participant TranslateService
 *   participant i18n
 *
 *   Client->>TranslateService: get("welcome.message")
 *   TranslateService->>i18n: t("welcome.message")
 *   i18n-->>TranslateService: "Welcome!"
 *   TranslateService-->>Client: "Welcome!"
 *
 *   Client->>TranslateService: changeLanguage("pt")
 *   TranslateService->>i18n: changeLanguage("pt")
 *   i18n-->>TranslateService: Promise resolved
 *   TranslateService-->>Client: void
 *
 *   Client->>TranslateService: subscribe(callback)
 *   TranslateService->>i18n: on("languageChanged", callback)
 *
 *   Client->>TranslateService: unsubscribe(callback)
 *   TranslateService->>i18n: off("languageChanged", callback)
 */
class TranslateServiceImpl implements ILocaleService {
	/**
	 * @description Retrieves the translated string for the provided key.
	 * @summary Uses the i18n library to return the translation corresponding to the specified key.
	 * @param {string} key - The translation key to look up.
	 * @return {string} The translated string associated with the key.
	 */
	get(key: string): string {
		return i18n.t(key);
	}

	/**
	 * @description Sets a translation context for grouped keys.
	 * @summary Creates a scoped accessor for translations within a specific context, simplifying retrieval of grouped keys.
	 * @param {string} ctx - The translation context prefix (e.g., "errors").
	 * @return {{ get: (key: string) => string }} An object exposing a `get` function to resolve context-based translations.
	 */
	setContext(ctx: string) {
		return {
			get: (key: string) => this.get(`${ctx}.${key}`),
		};
	}

	/**
	 * @description Changes the current application language.
	 * @summary Delegates to i18n's `changeLanguage` method to switch the language at runtime.
	 * @param {SupportedLocales} lang - The new language to set.
	 * @return {Promise<void>} A promise that resolves when the language has been changed.
	 */
	async changeLanguage(lang: SupportedLocales) {
		await i18n.changeLanguage(lang);
	}

	/**
	 * @description Gets the current active language.
	 * @summary Returns the language code currently in use by the application.
	 * @return {SupportedLocales} The current language code.
	 */
	getCurrentLanguage(): SupportedLocales {
		return i18n.language as SupportedLocales;
	}

	/**
	 * @description Lists all available languages.
	 * @summary Extracts supported locales from i18n resources.
	 * @return {SupportedLocales[]} An array of supported locale codes.
	 */
	getAvailableLanguages(): SupportedLocales[] {
		return Object.keys(i18n.options.resources || {}) as SupportedLocales[];
	}

	/**
	 * @description Sets a fallback language.
	 * @summary Defines the default language used when a translation key is missing.
	 * @param {SupportedLocales} lang - The fallback language to set.
	 * @return {void} No return value.
	 */
	setFallbackLanguage(lang: SupportedLocales) {
		i18n.options.fallbackLng = lang;
	}

	/**
	 * @description Retrieves all translations for a given language.
	 * @summary Returns the dictionary of translation keys and values for the specified locale.
	 * @param {SupportedLocales} lang - The target language to get translations for.
	 * @return {LocaleDictionary} The dictionary of translations for the given language.
	 */
	getTranslations(lang: SupportedLocales): LocaleDictionary {
		return (i18n.options.resources?.[lang]?.translation || {}) as LocaleDictionary;
	}

	/**
	 * @description Sets the current locale key.
	 * @summary Switches the application's language context using the provided locale key.
	 * @param {SupportedLocales} key - The locale code to set as current.
	 * @return {void} No return value.
	 */
	setCurrentLocaleKey(key: SupportedLocales) {
		i18n.changeLanguage(key);
	}

	/**
	 * @description Subscribes to language change events.
	 * @summary Registers a callback to be executed whenever the language changes.
	 * @param {() => void} callback - Function to call when the language changes.
	 * @return {void} No return value.
	 */
	subscribe(callback: () => void) {
		i18n.on("languageChanged", callback);
	}

	/**
	 * @description Unsubscribes from language change events.
	 * @summary Removes a previously registered callback for language changes.
	 * @param {() => void} callback - Function to remove from the event listener.
	 * @return {void} No return value.
	 */
	unsubscribe(callback: () => void) {
		i18n.off("languageChanged", callback);
	}
}

export const TranslateService = new TranslateServiceImpl();

/**
 * @description Hook for retrieving translations in React components.
 * @summary This hook integrates React's `useEffect` and `useState` with `TranslateService` to provide automatic updates to translated text when the language changes.
 * @param {string} key - The translation key to retrieve.
 * @param {string} [fallback] - Optional fallback string if the key is not found.
 * @return {string} The translated text, or the fallback if unavailable.
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   const message = useTranslate("welcome.message", "Hello!");
 *   return <Text>{message}</Text>;
 * };
 * ```
 */
export function useTranslate(key: string, fallback?: string) {
	const [text, setText] = useState(() => TranslateService.get(key));

	useEffect(() => {
		const update = () => setText(TranslateService.get(key));

		update();
		TranslateService.subscribe(update);

		return () => TranslateService.unsubscribe(update);
	}, [key]);

	return text || fallback || "";
}
