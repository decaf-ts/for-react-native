import React from "react";
import { VStack } from "@components/ui/vstack";
import { RnFormService } from "@/src/engine/RnFormService";

export interface RnDecafCrudFormProps {
	children?: React.ReactNode;
	props?: any;
	formProvider: RnFormService;
}

export const RnDecafCrudForm: React.FC<RnDecafCrudFormProps> = ({ props, children, formProvider }) => {
	return (
		<VStack space="md">
			<form>{children}</form>
		</VStack>
	);
};
