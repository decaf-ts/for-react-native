// Catch any errors thrown by the Layout component.
export { ErrorBoundary } from "expo-router";
import { Stack } from "expo-router";

export default function AppLayout() {
	return (
		<Stack>
			<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
		</Stack>
	);
}
