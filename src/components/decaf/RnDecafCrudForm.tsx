import React from "react";
import { VStack } from "@components/ui/vstack";
import { useFormContext } from "react-hook-form";

export interface RnDecafCrudFormProps {
	children?: React.ReactNode;
	props?: any;
}

export const RnDecafCrudForm: React.FC<RnDecafCrudFormProps> = ({ children, props }) => {
	const parentForm = useFormContext();

	const isRoot = !parentForm;
	console.log("$ CrudFORM props=", props, "->", children);

	if (isRoot) {
		return (
			<VStack space="md">
				<form>{children}</form>
			</VStack>
		);
	}

	return <VStack space="md">{children}</VStack>;
};
