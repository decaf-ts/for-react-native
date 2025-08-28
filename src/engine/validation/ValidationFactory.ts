import {
	ComparisonValidationKeys,
	DEFAULT_PATTERNS,
	PathProxy,
	PathProxyEngine,
	Validation,
	ValidationKeys,
} from "@decaf-ts/decorator-validation";
import { FieldProperties, HTML5InputTypes, parseValueByType } from "@decaf-ts/ui-decorators";
import { FieldValues, UseFormGetValues, UseFormReturn } from "react-hook-form";

type ComparisonValidationKey = (typeof ComparisonValidationKeys)[keyof typeof ComparisonValidationKeys];

export type Validator = (value: any) => true | string | any;

export type ValidatorKeyProps = {
	validatorKey: string;
	props: Record<string, unknown>;
};

function resolveValidatorKeyProps(validatorKey: string, value: unknown, type: string): ValidatorKeyProps {
	const extraValidators: Record<string, { key: string; value: any }> = {
		[ValidationKeys.TYPE]: {
			key: "types",
			value: value,
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
	const keyToUse = isTypeValidator ? type : validatorKey;

	const props: Record<string, unknown> = {
		[keyToUse]: value,
		...(extraValidation && { [extraValidation.key]: extraValidation.value }),
	};

	return { validatorKey: keyToUse, props };
}

export class ValidatorFactory {
	private static createProxy(control: Record<string, any>): PathProxy<unknown> {
		return PathProxyEngine.create(control, {
			getValue(target: any, prop: string): unknown {
				return (target as any)?.[prop];
			},
			getParent: function (target: any) {
				return target?.["_parent"];
			},
			ignoreUndefined: true,
			ignoreNull: true,
		});
	}

	private static spawn(fieldProps: FieldProperties, key: string, formGetValues: UseFormGetValues<any>) {
		if (!Validation.keys().includes(key)) throw new Error("Unsupported custom validation");

		const validatorFn = (value: any) => {
			console.log("validatorFn fieldProps=", fieldProps);
			const { name, type } = fieldProps;
			const { validatorKey, props } = resolveValidatorKeyProps(key, fieldProps[key as keyof FieldProperties], type);

			const validator = Validation.get(validatorKey);
			if (!validator) return `Unsupported validator: ${validatorKey}`;

			const parsedValue =
				typeof value !== "undefined"
					? parseValueByType(type, type === HTML5InputTypes.CHECKBOX ? name : value, fieldProps)
					: undefined;

			let proxy: Record<string, any> = {};
			if (Object.values(ComparisonValidationKeys).includes(key as ComparisonValidationKey)) {
				proxy = ValidatorFactory.createProxy(formGetValues());
			}

			let errs: string | undefined;
			try {
				errs = validator.hasErrors(parsedValue, props, proxy);
			} catch (e) {
				errs = `${key} validator failed to validate: ${e}`;
				console.warn(errs);
			}

			return errs ? errs : true;
		};

		Object.defineProperty(validatorFn, "name", { value: `${key}Validator` });
		Object.defineProperty(validatorFn, "fieldName", { value: fieldProps.path || fieldProps.name });

		return validatorFn;
	}

	static combineValidators(validators: Validator[]): Validator {
		return (value: any) => {
			for (const validator of validators) {
				const result = validator(value);
				if (result) return result; // return first error
			}
			return true;
		};
	}

	static validatorsFromProps(control: UseFormReturn<FieldValues, any, FieldValues>, props: FieldProperties): Validator {
		const supportedValidationKeys = Validation.keys();
		const validators = Object.keys(props)
			.filter((k: string) => supportedValidationKeys.includes(k))
			.map((validatorKey: string) => {
				return ValidatorFactory.spawn(props, validatorKey, control.getValues);
			});

		return ValidatorFactory.combineValidators(validators);
	}
}
