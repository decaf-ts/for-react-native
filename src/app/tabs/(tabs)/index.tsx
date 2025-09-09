import "reflect-metadata";
import { Center } from "@components/ui/center";
import { Divider } from "@components/ui/divider";
import { Heading } from "@components/ui/heading";
import { ComponentRegistry, RnRenderingEngine } from "@/src/engine";
import { RnDecafCrudField, RnDecafCrudForm, RnFieldset } from "@/src/components";
import { ScrollView, View } from "react-native";
import { ProfessionalInfoModel, UserProfileModel } from "@/src/models";
import { TranslateService } from "@/src/core/services";
import { Button, ButtonText } from "@components/ui/button";
import { HStack } from "@components/ui/hstack";
import React from "react";
import { LanguageSelector } from "@components/LanguageSelector";

const renderingEngine = new RnRenderingEngine();

const model = new UserProfileModel({
	fullName: "John Smith",
	age: 18,
	birthDate: "1985-05-15",
	email: "john.smith@example.com",
	password: "P@ssw0rd01",
	phone: "(11) 98765-4321",
	gender: "male",
	address: {
		street: "Main Street",
		// number: "100",
		complement: "Apt 101",
		zipCode: "12345-000",
		city: "New York",
		state: undefined,
	},

	professionalInfo: new ProfessionalInfoModel({
		position: 3,
		// specialization: "mobile",
		company: "Tech Solutions Inc.",
		jobDescription: "Managing development teams",

		companyAddress: {
			street: "Business Avenue",
			number: 500,
			// zipCode: "12345-001",
			city: "New York",
			// state: undefined,
		} as any,
	}),

	preferences: {
		emailNotifications: true,
		theme: "dark",
		language: "en",
	},

	acceptTerms: true,
});

// import "@components/NgxDecafCrudForm";
ComponentRegistry.register("ngx-decaf-crud-form", RnDecafCrudForm);
ComponentRegistry.register("ngx-decaf-crud-field", RnDecafCrudField);
ComponentRegistry.register("ngx-decaf-fieldset", RnFieldset);

export default function Home() {
	return (
		<ScrollView>
			<Center>
				<Heading>Example</Heading>
				<HStack space="sm">
					<LanguageSelector></LanguageSelector>
				</HStack>

				<Divider style={{ marginVertical: 16 }} />

				{renderingEngine.render(model)}
			</Center>
		</ScrollView>
	);
}
