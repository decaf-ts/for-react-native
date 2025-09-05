import React from "react";
import { VStack } from "@components/ui/vstack";
import type { RnFormService } from "@engine/RnFormService";
import { Button, ButtonText } from "@components/ui/button";
import { HStack } from "@components/ui/hstack";
import { StyleSheet } from "react-native";

export interface RnDecafCrudFormProps {
	children?: React.ReactNode;
	props?: any;
	formProvider: RnFormService;
}

export const RnDecafCrudForm: React.FC<RnDecafCrudFormProps> = (formProps: RnDecafCrudFormProps) => {
	const { children, formProvider } = formProps;
	const styles = StyleSheet.create({
		footer: { marginTop: 10, marginBottom: 20, gap: 10 },
		button: { flex: 1 },
	});
	return (
		<VStack space="md">
			<form>{children}</form>
			<HStack space="sm" style={styles.footer}>
				<Button style={styles.button} onPress={() => formProvider.reset()}>
					<ButtonText>Cancel</ButtonText>
				</Button>
				<Button style={styles.button} onPress={() => formProvider.submit()}>
					<ButtonText>Submit</ButtonText>
				</Button>
			</HStack>
		</VStack>
	);
};
