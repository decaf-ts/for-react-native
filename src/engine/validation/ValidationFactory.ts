import {
	ComparisonValidationKeys,
	DEFAULT_PATTERNS,
	PathProxy,
	PathProxyEngine,
	Validation,
	ValidationKeys,
} from "@decaf-ts/decorator-validation";
import { HTML5InputTypes, parseValueByType } from "@decaf-ts/ui-decorators";
import { ControlFieldProps } from "@/src/engine/types";
import { RnFormService } from "@/src/engine/RnFormService";
import { RnRenderingEngine } from "@/src/engine";

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

export class ValidatorFactory {
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

	private static spawn(fieldProps: ControlFieldProps, key: string) {
		if (!Validation.keys().includes(key)) throw new Error("Unsupported custom validation");

		let proxy: Record<string, any> = {};
		const additionalProps: Record<string, any> = {};
		if (Object.values(ComparisonValidationKeys).includes(key as ComparisonValidationKey)) {
			proxy = ValidatorFactory.createProxy(fieldProps.formProvider);
		}

		const validatorFn = (value: any) => {
			const { name, type } = fieldProps;
			const { validatorKey, props } = resolveValidatorKeyProps(key, fieldProps[key as keyof ControlFieldProps], type);

			const validator = Validation.get(validatorKey);
			if (!validator) return `Unsupported validator: ${validatorKey}`;

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
					console.log("Control=", comparisonPropControl);
					additionalProps["label"] = comparisonPropControl?.label;
				}
				errs = validator.hasErrors(parsedValue, { ...props, ...additionalProps }, proxy);
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
