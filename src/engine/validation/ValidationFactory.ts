import { ComparisonValidationKeys, DEFAULT_PATTERNS, Validation, ValidationKeys } from "@decaf-ts/decorator-validation";
import { FieldProperties, HTML5InputTypes, parseValueByType } from "@decaf-ts/ui-decorators";
import { UseFormGetValues } from "react-hook-form";

type ComparisonValidationKey = typeof ComparisonValidationKeys[keyof typeof ComparisonValidationKeys];

export type Validator = (value: any) => true | string;

const resolveValidatorKeyProps = (key: string, value: unknown, type: string) => {
  const patternValidators: Record<string, unknown> = {
    [ValidationKeys.PASSWORD]: DEFAULT_PATTERNS.PASSWORD.CHAR8_ONE_OF_EACH,
    [ValidationKeys.EMAIL]: DEFAULT_PATTERNS.EMAIL,
    [ValidationKeys.URL]: DEFAULT_PATTERNS.URL,
  };

  const isTypeBased = key === ValidationKeys.TYPE && Object.keys(patternValidators).includes(type);
  const validatorKey = isTypeBased ? type : key;
  const props: Record<string, unknown> = {
    [validatorKey]: value,
    ...(isTypeBased && { [ValidationKeys.PATTERN]: patternValidators[type] }),
  };

  return { validatorKey, props };
};

export class ValidatorFactory {
  private static spawn(fieldProps: FieldProperties, key: string, getValues: UseFormGetValues<any>) {
    if (!Validation.keys().includes(key)) {
      throw new Error("Unsupported custom validation");
    }

    return (value: any) => {
      const { name, type } = fieldProps;
      const { validatorKey, props } = resolveValidatorKeyProps(
        key,
        fieldProps[key as keyof FieldProperties],
        type,
      );

      const validator = Validation.get(validatorKey);
      if (!validator)
        return `Unsupported validator: ${validatorKey}`;

      const parsedValue = typeof value !== "undefined"
        ? parseValueByType(type, type === HTML5InputTypes.CHECKBOX ? name : value, fieldProps)
        : undefined;

      let proxy: Record<string, any> = {};
      if (Object.values(ComparisonValidationKeys).includes(key as ComparisonValidationKey)) {
        // proxy = getValues();
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
  }

  static combineValidators(validators: Validator[]): Validator {
    return (value: any) => {
      for (const validator of validators) {
        const result = validator(value);
        if (result)
          return result; // return first error
      }
      return true;
    };
  }

  static validatorsFromProps(props: FieldProperties): Validator {
    const supportedValidationKeys = Validation.keys();
    const validators = Object.keys(props)
      .filter((k: string) => supportedValidationKeys.includes(k))
      .map((validatorKey: string) => {
        return ValidatorFactory.spawn(props, validatorKey, {} as any);
      });

    return ValidatorFactory.combineValidators(validators);
  }

}
