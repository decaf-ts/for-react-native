import React from "react";
import { VStack } from "@components/ui/vstack";
import { useFormContext } from "react-hook-form";

export interface RnDecafCrudFormProps {
	children?: React.ReactNode;
	props?: any;
}

export const RnDecafCrudForm: React.FC<RnDecafCrudFormProps> = (propsx) => {
	const { children, props } = propsx;
	console.log("$ RnDecafCrudForm props=", propsx);
	const parentForm = useFormContext();

	const isRoot = !parentForm;
	console.log("$ CrudFORM props=", props, "->", children);

	if (isRoot) {
		return (
			// <FormProvider {...methods}>
			// </FormProvider>
			<VStack space="md">
				<form>{children}</form>
			</VStack>
		);
	}

	return <VStack space="md">{children}</VStack>;
};
