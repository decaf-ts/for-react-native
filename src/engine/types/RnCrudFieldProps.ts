import { Control, FieldValues } from "react-hook-form";
import { FieldProperties } from "@decaf-ts/ui-decorators";
import { OperationKeys } from "@decaf-ts/db-decorators";
import type { RnFormService } from "@engine/RnFormService";
import { Validator } from "@/src/engine";

export type Option = {
	text: string;
	value: string;
	disabled?: boolean;
};

export type PossibleInputTypes =
	| "text"
	| "password"
	| "number"
	| "email"
	| "tel"
	| "date"
	| "time"
	| "textarea"
	| "checkbox"
	| "radio"
	| "select"
	| "range";

export interface RnDecafCrudFieldProps extends FieldProperties {
	label?: string;
	// operation?: CrudOperations;
	operation?: OperationKeys;
	inputType?: PossibleInputTypes;
	placeholder?: string;
	options?: Option[];
	size?: "sm" | "md" | "lg";
	space?: "sm" | "md" | "lg";
	variant?: "underlined" | "outline" | "rounded";
}

export interface ControlFieldProps extends RnDecafCrudFieldProps {
	formProvider: RnFormService;
	validateFn?: Validator;
	// control: Control<FieldValues, any, FieldValues>;
}
