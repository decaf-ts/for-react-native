import React from "react";
import { VStack } from "@components/ui/vstack";
import { Button, ButtonText } from "@components/ui/button";
import { HStack } from "@components/ui/hstack";
import { StyleSheet } from "react-native";
import { FormProvider, SubmitHandler, useForm, useFormContext } from "react-hook-form";

export interface RnDecafCrudFormProps {
	children?: React.ReactNode;
	props?: any;
}

export const RnDecafCrudForm: React.FC<RnDecafCrudFormProps> = ({ children, props }) => {
	const parentForm = useFormContext();

	const isRoot = !parentForm;
	const methods = useForm({ defaultValues: props?.defaultValues || {} });
	const onSubmit: SubmitHandler<any> = (data) => {
		console.log(data);
	};

	if (isRoot) {
		// Root form
		return (
			<FormProvider {...methods}>
				<VStack space="md">
					<form onSubmit={methods.handleSubmit(onSubmit)}>{children}</form>
					<HStack space="sm" style={styles.footer}>
						<Button style={styles.button} onPress={() => methods.reset()}>
							<ButtonText>Cancel</ButtonText>
						</Button>
						<Button style={styles.button} onPress={methods.handleSubmit(onSubmit)}>
							<ButtonText>Submit</ButtonText>
						</Button>
					</HStack>
				</VStack>
			</FormProvider>
		);
	}

	return <VStack space="md">{children}</VStack>;
};

const styles = StyleSheet.create({
	footer: {
		marginTop: 10,
		marginBottom: 20,
		gap: 10,
	},
	button: {
		flex: 1,
	},
});
