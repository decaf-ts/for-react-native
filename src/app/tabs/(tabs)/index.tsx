import "reflect-metadata";
import { Center } from "@components/ui/center";
import { Divider } from "@components/ui/divider";
import { Heading } from "@components/ui/heading";
import { ComponentRegistry, ReactNativeRenderingEngine } from "@/src/engine";
import { RnDecafCrudForm } from "@components/decaf/RnDecafCrudForm";
import { RnDecafCrudField } from "@components/decaf/RnDecafCrudField";
import { DemoModel } from "@/src/models/DemoModel";

const renderingEngine = new ReactNativeRenderingEngine();
const model = new DemoModel({
	id: 1,
	name: "John Doe",
	// birthdate: '1989-12-12',
	email: "john.doe@example.com",
	website: "https://johndoe.example.com",
	password: "password123",
	category: {
		name: "Demo Category",
		description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
	},
	user: { username: "Admin", secret: "DemoPass" },
	gender: "male",
	birthdate: "1989-12-12",
});

// import "@components/NgxDecafCrudForm";
// import "@components/NgxDecafCrudField";

ComponentRegistry.register("ngx-decaf-crud-form", RnDecafCrudForm);
ComponentRegistry.register("ngx-decaf-crud-field", RnDecafCrudField);

// export default function Home() {
// 	const render = renderingEngine.render(model);
//
// 	return (
// 		<Center className="flex-1">
// 			<Heading className="font-bold text-2xl">Example</Heading>
// 			<Divider className="my-[30px] w-[80%]" />
// 			<Text className="p-4">Tabs example for-react-native.</Text>
// 			<EditScreenInfo path="app/(app)/(tabs)/index.tsx" />
// 			<Center className="flex-1">{renderingEngine.render(model)}</Center>
// 		</Center>
// 	);
// }

export default function Home() {
	return (
		<Center>
			<Heading>Example</Heading>
			<Divider />
			{renderingEngine.render(model)}
		</Center>
	);
}
