import "reflect-metadata";
import { Center } from "@components/ui/center";
import { Divider } from "@components/ui/divider";
import { Heading } from "@components/ui/heading";
import { ComponentRegistry, RnRenderingEngine } from "@/src/engine";
import { RnDecafCrudForm } from "@components/decaf/RnDecafCrudForm";
import { RnDecafCrudField } from "@components/decaf/RnDecafCrudField";
import { ScrollView } from "react-native";
import { UserProfileModel } from "@/src/models/UserProfileModel";
import { RnFieldset } from "@components/decaf/RnFieldset";

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
		number: "100",
		complement: "Apt 101",
		zipCode: "12345-000",
		city: "New York",
		state: undefined,
	},

	professionalInfo: {
		position: "manager",
		specialization: "mobile",
		company: "Tech Solutions Inc.",
		jobDescription: "Managing development teams",

		companyAddress: {
			street: "Business Avenue",
			number: "500",
			zipCode: "12345-001",
			city: "New York",
			state: undefined,
		},
	},

	preferences: {
		emailNotifications: true,
		theme: "dark",
		language: "en",
	},

	acceptTerms: true,
});

// import "@components/NgxDecafCrudForm";
// import "@components/NgxDecafCrudField";

ComponentRegistry.register("ngx-decaf-crud-form", RnDecafCrudForm);
ComponentRegistry.register("ngx-decaf-crud-field", RnDecafCrudField);
ComponentRegistry.register("ngx-decaf-fieldset", RnFieldset);

export default function Home() {
	return (
		<ScrollView>
			<Center>
				<Heading>Example</Heading>
				<Divider />
				{renderingEngine.render(model)}
			</Center>
		</ScrollView>
	);
}
