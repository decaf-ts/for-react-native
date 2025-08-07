import "reflect-metadata";
import { UserModel } from "@/src/models";
import EditScreenInfo from "@components/EditScreenInfo";
import { Center } from "@components/ui/center";
import { Divider } from "@components/ui/divider";
import { Heading } from "@components/ui/heading";
import { Text } from "@components/ui/text";
import { ReactNativeRenderingEngine } from "@/src/engine";

const renderingEngine = new ReactNativeRenderingEngine();
const model = new UserModel({
	username: "test",
	secret: "P@ssw0rd01",
});

export default function Home() {
	const render = renderingEngine.render(model);
	// console.log("Has design:type:", Reflect.hasMetadata("design:type", Example.prototype, "name"));

	return (
		<Center className="flex-1">
			<Heading className="font-bold text-2xl">Example</Heading>
			<Divider className="my-[30px] w-[80%]" />
			<Text className="p-4">Tabs example for-react-native.</Text>
			<EditScreenInfo path="app/(app)/(tabs)/index.tsx" />
			<Text>{JSON.stringify(render, null, 2)}</Text>
		</Center>
	);
}
