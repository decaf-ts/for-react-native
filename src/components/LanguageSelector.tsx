import React, { useState } from "react";
import { HStack } from "@components/ui/hstack";
import { TranslateService, useTranslate } from "@/src/core";
import {
	Select,
	SelectBackdrop,
	SelectContent,
	SelectDragIndicator,
	SelectDragIndicatorWrapper,
	SelectIcon,
	SelectInput,
	SelectItem,
	SelectPortal,
	SelectTrigger,
} from "@components/ui/select";
import { ChevronDownIcon } from "@components/ui/icon";

export function LanguageSelector() {
	const languages = TranslateService.getAvailableLanguages();
	const [selectedLang, setSelectedLang] = useState<string>(
		useTranslate(["languages", TranslateService.getCurrentLanguage()].join("."))
	);

	const onChangeLanguage = (lang: string) => {
		console.log("Change language", lang);
		setSelectedLang(lang);
		TranslateService.changeLanguage(lang as any);
	};

	return (
		<HStack space="sm" style={{ justifyContent: "flex-end" }}>
			<Select onValueChange={onChangeLanguage} selectedValue={selectedLang}>
				<SelectTrigger variant="outline" size="md">
					<SelectInput placeholder={"Select option"} />
					<SelectIcon as={ChevronDownIcon} />
				</SelectTrigger>
				<SelectPortal>
					<SelectBackdrop />
					<SelectContent>
						<SelectDragIndicatorWrapper>
							<SelectDragIndicator />
						</SelectDragIndicatorWrapper>
						{languages.map((option) => (
							<SelectItem key={option} label={useTranslate(`languages.${option}`)} value={option} />
						))}
					</SelectContent>
				</SelectPortal>
			</Select>
		</HStack>
	);
}
