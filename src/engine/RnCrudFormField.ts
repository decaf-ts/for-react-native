import { Control, UseFormGetValues } from "react-hook-form";
import { FieldProperties } from "@decaf-ts/ui-decorators";
import { PossibleInputTypes } from "./types";
import { CrudOperations } from "@decaf-ts/db-decorators";
import { sf } from "@decaf-ts/decorator-validation";

export class RnCrudFormField implements FieldProperties {
	operation!: CrudOperations;

	readonly parent!: any;
	form!: any | undefined;
	control!: Control<any>;

	name!: string;
	path!: string;
	childOf?: string;
	type!: PossibleInputTypes;
	disabled?: boolean;

	// Validation
	format?: string;
	hidden?: boolean;
	max?: number | Date;
	maxlength?: number;
	min?: number | Date;
	minlength?: number;
	pattern?: string | undefined;
	readonly?: boolean;
	required?: boolean;
	step?: number;
	equals?: string;
	different?: string;
	lessThan?: string;
	lessThanOrEqual?: string;
	greaterThan?: string;
	greaterThanOrEqual?: string;

	value!: string | number | Date;

	/**
	 * @summary String formatting function
	 * @description Provides access to the sf function for error message formatting
	 * @prop {function(string, ...string): string} sf - String formatting function
	 */
	sf = sf;

	/**
	 * @summary Change callback function
	 * @description Function called when the field value changes
	 * @property {function(): unknown} onChange - onChange event handler
	 */
	onChange: () => unknown = () => {};

	/**
	 * @summary Touch callback function
	 * @description Function called when the field is touched
	 * @property {function(): unknown} onTouch - onTouch event handler
	 */
	onTouch: () => unknown = () => {};

	/**
	 * @summary Write value to the field
	 * @description Sets the value of the field
	 * @param {string} obj - The value to be set
	 */
	writeValue(obj: string): void {
		this.value = obj;
	}

	/**
	 * @summary Register change callback
	 * @description Registers a function to be called when the field value changes
	 * @param {function(): unknown} fn - The function to be called on change
	 */
	registerOnChange(fn: () => unknown): void {
		this.onChange = fn;
	}

	/**
	 * @summary Register touch callback
	 * @description Registers a function to be called when the field is touched
	 * @param {function(): unknown} fn - The function to be called on touch
	 */
	registerOnTouched(fn: () => unknown): void {
		this.onTouch = fn;
	}

	/**
	 * @summary Set disabled state
	 * @description Sets the disabled state of the field
	 * @param {boolean} isDisabled - Whether the field should be disabled
	 */
	setDisabledState?(isDisabled: boolean): void {
		this.disabled = isDisabled;
	}

	/**
	 * @summary Get field errors
	 * @description Retrieves all errors associated with the field
	 * @returns {string|void} An array of error objects
	 */
	getErrors(parent: HTMLElement): string | void {}

	getParent(): RnCrudFormField | undefined {
		return this.parent;
	}

	getValue(getValues: UseFormGetValues<any>) {
		return getValues(this.path);
	}

	// Exemplo para checar se o campo é válido via RHF (pode customizar)
	isValid(formState: { errors: Record<string, any> }) {
		return !formState.errors?.[this.path];
	}

	getProps() {
		// return { ...this.props };
	}
}
