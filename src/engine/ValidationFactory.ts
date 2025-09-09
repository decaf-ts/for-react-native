import {
	ComparisonValidationKeys,
	DEFAULT_PATTERNS,
	PathProxy,
	PathProxyEngine,
	Validation,
	ValidationKeys,
} from "@decaf-ts/decorator-validation";
import { HTML5InputTypes, parseValueByType } from "@decaf-ts/ui-decorators";
import { ControlFieldProps, RnFormService, RnRenderingEngine } from "@/src/engine";

type ComparisonValidationKey = (typeof ComparisonValidationKeys)[keyof typeof ComparisonValidationKeys];

export type Validator = (value: any) => { key: string; message: string } | undefined; // boolean | string | undefined;

export type ValidatorKeyProps = {
	validatorKey: string;
	props: Record<string, unknown>;
};

function resolveValidatorKeyProps(validatorKey: string, value: unknown, type: string): ValidatorKeyProps {
	const extraValidators: Record<string, { key: string; value: any }> = {
		[ValidationKeys.TYPE]: {
			key: "types",
			value: RnRenderingEngine.get().translate(value as string, false),
		},
		[ValidationKeys.PASSWORD]: {
			key: ValidationKeys.PATTERN,
			value: DEFAULT_PATTERNS.PASSWORD.CHAR8_ONE_OF_EACH,
		},
		[ValidationKeys.EMAIL]: {
			key: ValidationKeys.PATTERN,
			value: DEFAULT_PATTERNS.EMAIL,
		},
		[ValidationKeys.URL]: {
			key: ValidationKeys.PATTERN,
			value: DEFAULT_PATTERNS.URL,
		},
	};

	const isTypeValidator = validatorKey === ValidationKeys.TYPE;
	const extraValidation = isTypeValidator ? extraValidators[type] || extraValidators[ValidationKeys.TYPE] : undefined;
	const keyToUse = [ValidationKeys.PASSWORD, ValidationKeys.EMAIL, ValidationKeys.URL].includes(type as any)
		? type
		: validatorKey;

	const props: Record<string, unknown> = {
		[keyToUse]: isTypeValidator ? RnRenderingEngine.get().translate(value as string, false) : value,
		...(extraValidation && { [extraValidation.key]: extraValidation.value }),
	};

	return { validatorKey: keyToUse, props };
}

/**
 * @description Factory class for creating field validators.
 * @summary The `ValidatorFactory` integrates with `@decaf-ts/decorator-validation` and `RnFormService` to dynamically build validation functions for form fields. It supports comparison validators, parsing values based on HTML5 input types, and automatically wiring validators from props. The generated validators return `true` if validation succeeds or an error message otherwise.
 *
 * @param {ControlFieldProps} props - Field configuration used to derive validators.
 *
 * @class
 *
 * @example
 * ```ts
 * import { ValidatorFactory } from "./ValidatorFactory";
 * import { ControlFieldProps } from "@/src/engine/types";
 *
 * const props: ControlFieldProps = {
 *   name: "email",
 *   type: "email",
 *   required: true,
 *   formProvider: formService,
 * };
 *
 * const validator = ValidatorFactory.validatorsFromProps(props);
 * console.log(validator("invalid-email")); // => "Invalid email format"
 * ```
 *
 * @mermaid
 * sequenceDiagram
 *   participant U as User
 *   participant VF as ValidatorFactory
 *   participant V as Validation
 *   participant FS as RnFormService
 *
 *   U->>VF: validatorsFromProps(props)
 *   VF->>VF: filter supported keys
 *   VF->>VF: spawn validators
 *   VF->>V: Validation.get(key)
 *   VF->>FS: getControl(path)
 *   VF->>U: Combined validator function
 */
export class ValidatorFactory {
	/**
	 * @description Creates a `PathProxy` for resolving form paths.
	 * @summary Wraps a `RnFormService` instance with a proxy engine to enable validation functions to access field values and parent services by path.
	 * @param {Record<string, any>} control - The form control object, typically a `RnFormService`.
	 * @return {PathProxy<unknown>} A proxy for resolving form values and parent references.
	 */
	private static createProxy(control: Record<string, any>): PathProxy<unknown> {
		return PathProxyEngine.create(control, {
			getValue(target: any, prop: string): unknown {
				const t = (target as RnFormService).getControl(prop);
				if (t instanceof RnFormService) return t;
				return (target as RnFormService).getValues(prop);
			},
			getParent: function (target: any) {
				return (target as RnFormService)?._parent;
			},
			ignoreUndefined: true,
			ignoreNull: true,
		});
	}

	/**
	 * @description Creates a validator function for a given field and validation key.
	 * @summary Builds a validator by resolving validator props, checking for comparison keys, and wiring `Validation.get()`. The returned function parses values by input type, applies validation rules, and provides additional props like field labels for comparison validators.
	 * @param {ControlFieldProps} fieldProps - Field configuration including metadata, type, and provider.
	 * @param {string} key - Validation key identifying the rule to apply (e.g., `"required"`, `"pattern"`).
	 * @return {Validator} A validator function that returns `true` if valid or an error message string.
	 */
	private static spawn(fieldProps: ControlFieldProps, key: string) {
		if (!Validation.keys().includes(key)) throw new Error("Unsupported custom validation");

		let proxy: Record<string, any> = {};
		const additionalProps: Record<string, any> = {};
		if (Object.values(ComparisonValidationKeys).includes(key as ComparisonValidationKey)) {
			proxy = ValidatorFactory.createProxy(fieldProps.formProvider);
		}

		const validatorFn: Validator = (value: any) => {
			const { name, type } = fieldProps;
			const { validatorKey, props } = resolveValidatorKeyProps(key, fieldProps[key as keyof ControlFieldProps], type);

			const validator = Validation.get(validatorKey);
			if (!validator) return { key, message: `Unsupported validator: ${validatorKey}` };

			const parsedValue =
				typeof value !== "undefined"
					? parseValueByType(type, type === HTML5InputTypes.CHECKBOX ? name : value, fieldProps)
					: undefined;

			let errs: string | undefined;
			try {
				if (Object.values(ComparisonValidationKeys).includes(key as ComparisonValidationKey)) {
					const comparisonPropControl = (fieldProps.formProvider as RnFormService).getControl(
						(fieldProps as any)[key]
					) as ControlFieldProps;
					additionalProps["label"] = comparisonPropControl?.label;
				}
				errs = validator.hasErrors(parsedValue, { ...props, ...additionalProps }, proxy);
			} catch (e) {
				errs = `${key} validator failed to validate: ${e}`;
				console.warn(errs);
			}

			return errs ? { key, message: errs } : undefined;
		};

		Object.defineProperty(validatorFn, "name", { value: `${key}Validator` });
		Object.defineProperty(validatorFn, "fieldName", { value: fieldProps.path || fieldProps.name });

		return validatorFn;
	}

	/**
	 * @description Combines multiple validators into a single function.
	 * @summary Runs validators sequentially on a value and returns the first error encountered, or `true` if all validators succeed.
	 * @param {Validator[]} validators - Array of validator functions to compose.
	 * @return {Validator} A composed validator function.
	 */
	static combineValidators(validators: Validator[]): Validator {
		return (value: any) => {
			for (const validator of validators) {
				const result = validator(value);
				// return first error
				if (result && result?.message) {
					return result;
				}
			}
			return undefined;
		};
	}

	/**
	 * @description Builds validators directly from field props.
	 * @summary Scans the provided `ControlFieldProps` for supported validation keys, spawns corresponding validators, and combines them into a single function for use in form controls.
	 * @param {ControlFieldProps} props - Field configuration including validation attributes.
	 * @return {Validator} A validator function composed from field props.
	 */
	static validatorsFromProps(props: ControlFieldProps): Validator {
		const supportedValidationKeys = Validation.keys();
		const validators = Object.keys(props)
			.filter((k: string) => supportedValidationKeys.includes(k))
			.map((validatorKey: string) => {
				return ValidatorFactory.spawn(props, validatorKey);
			});

		return ValidatorFactory.combineValidators(validators);
	}
}
