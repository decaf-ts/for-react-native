import React from "react";
import { Control, Controller, FieldValues } from "react-hook-form";
import {
	FormControl,
	FormControlError,
	FormControlErrorIcon,
	FormControlErrorText,
	FormControlLabel,
	FormControlLabelText,
} from "@components/ui/form-control";
import { VStack } from "@components/ui/vstack";
import { Input, InputField, InputIcon, InputSlot } from "@components/ui/input";
import { Textarea, TextareaInput } from "@components/ui/textarea";
import {
	Checkbox,
	CheckboxGroup,
	CheckboxIcon,
	CheckboxIndicator,
	CheckboxLabel,
} from "@components/ui/checkbox";
import { Radio, RadioGroup, RadioIcon, RadioIndicator, RadioLabel } from "@components/ui/radio";
import {
	Select,
	SelectBackdrop,
	SelectContent,
	SelectDragIndicator,
	SelectDragIndicatorWrapper,
	SelectIcon,
	SelectInput,
	SelectItem,
	SelectPortal,
	SelectTrigger,
} from "@components/ui/select";
import {
	AlertCircleIcon,
	CheckIcon,
	ChevronDownIcon,
	CircleIcon,
	EyeIcon,
	EyeOffIcon,
} from "@components/ui/icon";
import { CrudOperations, OperationKeys } from "@decaf-ts/db-decorators";
import { Slider, SliderFilledTrack, SliderThumb, SliderTrack } from "@components/ui/slider";

type Option = {
	text: string;
	value: string;
	disabled?: boolean;
};

type PossibleInputTypes =
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

export interface RnDecafCrudFieldProps {
	operation?: CrudOperations;
	name: string;
	path: string;
	childOf?: string;
	type: string;
	inputType?: PossibleInputTypes;
	label?: string;
	value?: any;
	required?: boolean;
	min?: number;
	max?: number;
	minlength?: number;
	maxlength?: number;
	readonly?: boolean;
	placeholder?: string;
	options?: Option[];
	size?: "sm" | "md" | "lg";
	space?: "sm" | "md" | "lg";
	variant?: "underlined" | "outline" | "rounded";
	mask?: string;
	pattern?: string;
	validateFn?: (value: any) => string | boolean;
	control: Control<FieldValues, any, FieldValues>;
}

export const RnDecafCrudField: React.FC<RnDecafCrudFieldProps> = (
	fieldProps: RnDecafCrudFieldProps
) => {
	const {
		operation = OperationKeys.CREATE,
		type,
		inputType: originalInputType = "text",
		label,
		value,
		required = false,
		min,
		max,
		minlength,
		maxlength,
		readonly = false,
		placeholder,
		options = [],
		size = "md",
		space = "sm",
		variant = "underlined",
		control,
		...props
	} = fieldProps;

	const fieldName = props.path;
	const readonlyMode = [OperationKeys.READ, OperationKeys.DELETE].includes(operation);
	const disabled = readonly || readonlyMode;
	const inputType = ["password", "email", "url"].includes(type) ? type : originalInputType;

	console.log("RnDecafCrudField props=", props);

	const renderLabel = () =>
		label && (
			<FormControlLabel>
				<FormControlLabelText aria-label={label}>{label}</FormControlLabelText>
			</FormControlLabel>
		);

	return (
		<Controller
			control={control}
			name={fieldName}
			defaultValue={value || ""}
			rules={{
				validate: (value: any) => {
					return fieldProps.validateFn ? fieldProps.validateFn(value) : true;
				},
			}}
			render={({ field, fieldState }) => {
				let component: React.ReactNode = null;

				switch (inputType) {
					case "textarea":
						component = (
							<>
								{renderLabel()}
								<Textarea>
									<TextareaInput
										value={field.value}
										onChangeText={field.onChange}
										placeholder={placeholder}
										maxLength={maxlength}
									/>
								</Textarea>
							</>
						);
						break;

					case "checkbox":
						if (!options?.length) {
							component = (
								<Checkbox
									aria-label={label}
									size={size}
									isChecked={!!field.value}
									onChange={(checked) => field.onChange(checked)}
									value=""
								>
									<CheckboxIndicator className="mr-2">
										<CheckboxIcon as={CheckIcon} />
									</CheckboxIndicator>
									<CheckboxLabel>{label}</CheckboxLabel>
								</Checkbox>
							);
						} else {
							component = (
								<>
									{renderLabel()}
									<CheckboxGroup
										value={field.value || []}
										onChange={(keys) => field.onChange(keys)}
									>
										<VStack space={space}>
											{options.map((option) => (
												<Checkbox
													key={option.value}
													size={size}
													value={option.value}
													isDisabled={option.disabled}
												>
													<CheckboxIndicator className="mr-2">
														<CheckboxIcon as={CheckIcon} />
													</CheckboxIndicator>
													<CheckboxLabel>{option.text}</CheckboxLabel>
												</Checkbox>
											))}
										</VStack>
									</CheckboxGroup>
								</>
							);
						}
						break;

					case "radio":
						component = (
							<>
								{renderLabel()}
								<RadioGroup value={field.value} onChange={field.onChange}>
									<VStack space={space}>
										{options.map((option) => (
											<Radio
												key={option.value}
												id={`${fieldName}-${option.value}`}
												size={size}
												value={option.value}
											>
												<RadioIndicator>
													<RadioIcon as={CircleIcon} />
												</RadioIndicator>
												<RadioLabel>{option.text}</RadioLabel>
											</Radio>
										))}
									</VStack>
								</RadioGroup>
							</>
						);
						break;

					case "select":
						component = (
							<>
								{renderLabel()}
								<Select
									onValueChange={field.onChange}
									selectedValue={options.find((option) => option.value === value)?.text}
								>
									<SelectTrigger variant="outline" size={size}>
										<SelectInput placeholder={placeholder || "Select option"} />
										<SelectIcon as={ChevronDownIcon} />
									</SelectTrigger>
									<SelectPortal>
										<SelectBackdrop />
										<SelectContent>
											<SelectDragIndicatorWrapper>
												<SelectDragIndicator />
											</SelectDragIndicatorWrapper>
											{options.map((option) => (
												<SelectItem
													key={option.value}
													label={option.text}
													value={option.value}
													isDisabled={option.disabled}
												/>
											))}
										</SelectContent>
									</SelectPortal>
								</Select>
							</>
						);
						break;

					case "range":
						component = (
							<>
								{renderLabel()}
								<Slider
									minValue={min || 0}
									maxValue={max || 100}
									step={1}
									value={field.value}
									onChange={field.onChange}
									isDisabled={disabled}
								>
									<SliderTrack>
										<SliderFilledTrack />
									</SliderTrack>
									<SliderThumb />
								</Slider>
							</>
						);
						break;

					case "password":
						const [showPassword, setShowPassword] = React.useState(false);
						component = (
							<>
								{renderLabel()}
								<Input size={size}>
									<InputField
										type={showPassword ? "text" : "password"}
										value={field.value}
										placeholder={placeholder}
										maxLength={maxlength}
										onChangeText={field.onChange}
									/>
									<InputSlot className="pr-3" onPress={() => setShowPassword((prev) => !prev)}>
										<InputIcon as={showPassword ? EyeIcon : EyeOffIcon} />
									</InputSlot>
								</Input>
							</>
						);
						break;

					case "date":
						component = null;
						break;

					default:
						component = (
							<>
								{renderLabel()}
								<Input size={size}>
									<InputField
										type="text" // {type}
										variant={variant}
										keyboardType={type === "number" ? "numeric" : "default"}
										value={field.value}
										placeholder={placeholder}
										maxLength={maxlength}
										onChangeText={field.onChange}
										onBlur={field.onBlur}
									/>
								</Input>
							</>
						);
						break;
				}

				return (
					<VStack space={space}>
						<FormControl isRequired={required} isDisabled={disabled} isInvalid={!!fieldState.error}>
							{component}
							<FormControlError>
								<FormControlErrorIcon as={AlertCircleIcon} />
								{fieldState.error && (
									<FormControlErrorText>{fieldState.error.message}</FormControlErrorText>
								)}
							</FormControlError>
						</FormControl>
					</VStack>
				);
			}}
		/>
	);
};
