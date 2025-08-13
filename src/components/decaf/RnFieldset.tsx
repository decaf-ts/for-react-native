import React from "react";
import { Box } from "@components/ui/box";
import { Text } from "@components/ui/text";
import { StyleSheet, View } from "react-native";

interface FieldsetProps {
	name: string;
	children: React.ReactNode;
}

export function RnFieldset({ name, children }: FieldsetProps) {
	return (
		<Box style={styles.fieldset}>
			<Text style={styles.legend}>{name}</Text>
			<View style={styles.content}>{children}</View>
		</Box>
	);
}

const styles = StyleSheet.create({
	fieldset: {
		marginTop: 20,
		borderWidth: 1,
		borderColor: "#aaa",
		borderRadius: 4,
		padding: 10,
		paddingTop: 20,
		marginVertical: 50,
	},
	legend: {
		position: "absolute",
		top: -10,
		left: 10,
		backgroundColor: "#e5e7eb",
		paddingHorizontal: 4,
		fontWeight: "bold",
		fontSize: 14,
	},
	content: {
		marginTop: 5,
	},
});
