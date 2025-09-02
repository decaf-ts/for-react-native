import React from "react";
import { Box } from "@components/ui/box";
import { Text } from "@components/ui/text";
import { StyleSheet, View } from "react-native";

interface FieldsetProps {
	name: string;
	children: React.ReactNode;
	formProvider: any;
}

export function RnFieldset({ name, children, formProvider }: FieldsetProps) {
	// const methods = formProvider.getMethods();
	return (
		<View style={styles.wrapper}>
			{/* Title*/}
			<View style={styles.legendContainer}>
				<Text style={styles.legend}>{name}</Text>
			</View>

			<Box style={styles.fieldset}>
				{/*<FormProvider {...methods}>*/}
				<View style={styles.content}>{children}</View>
				{/*</FormProvider>*/}
			</Box>
		</View>
	);
}

const styles = StyleSheet.create({
	wrapper: {
		marginTop: 20,
		position: "relative",
	},
	legendContainer: {
		position: "absolute",
		top: -10,
		left: 10,
		backgroundColor: "rgba(0,0,0,0.00)",
		paddingHorizontal: 8,
		zIndex: 1,
	},
	legend: {
		fontWeight: "bold",
		fontSize: 14,
	},
	fieldset: {
		padding: 16,
		borderWidth: 1,
		borderColor: "#d1d5db",
		borderRadius: 8,
	},
	content: {
		marginTop: 4,
		padding: 14,
	},
});
