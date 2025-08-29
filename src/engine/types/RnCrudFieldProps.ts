import { Control, FieldValues } from "react-hook-form";
import { FieldProperties } from "@decaf-ts/ui-decorators";

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
	inputType?: PossibleInputTypes;
	placeholder?: string;
	options?: Option[];
	size?: "sm" | "md" | "lg";
	space?: "sm" | "md" | "lg";
	variant?: "underlined" | "outline" | "rounded";
}

export interface ControlFieldProps extends RnDecafCrudFieldProps {
	formProvider?: any;
	validateFn?: (value: any) => string | boolean;
	control: Control<FieldValues, any, FieldValues>;
}
