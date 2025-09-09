import React from "react";
import { Box } from "@components/ui/box";
import { Text } from "@components/ui/text";
import { StyleSheet, View } from "react-native";
import type { RnFormService } from "@engine/RnFormService";
import { useTranslate } from "@/src/core";

interface FieldsetProps {
	name: string;
	childOf: string;
	children: React.ReactNode;
	formProvider: RnFormService;
}

export function RnFieldset(props: FieldsetProps) {
	const { name, childOf, children } = props;
	const label = childOf ? [childOf, "label"].join(".") : name;
	const styles = StyleSheet.create({
		wrapper: { marginTop: 20, position: "relative" },
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

	return (
		<View style={styles.wrapper}>
			{/* Title*/}
			<View style={styles.legendContainer}>
				<Text style={styles.legend}>{useTranslate(label, name)}</Text>
			</View>

			<Box style={styles.fieldset}>
				{/*<FormProvider {...methods}>*/}
				<View style={styles.content}>{children}</View>
				{/*</FormProvider>*/}
			</Box>
		</View>
	);
}
