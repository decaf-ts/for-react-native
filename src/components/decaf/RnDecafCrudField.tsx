import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { FormControl, FormControlLabel, FormControlLabelText } from "@components/ui/form-control";
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
import { CheckIcon, ChevronDownIcon, CircleIcon, EyeIcon, EyeOffIcon } from "@components/ui/icon";
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
	type?: PossibleInputTypes;
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
}

export const RnDecafCrudField: React.FC<RnDecafCrudFieldProps> = ({
	operation = OperationKeys.CREATE,
	type = "text",
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
	...props
}) => {
	const { control } = useFormContext();
	const fieldName = props.path;
	const readonlyMode = [OperationKeys.READ, OperationKeys.DELETE].includes(operation);
	const disabled = readonly || readonlyMode;

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
			defaultValue={value}
			render={({ field }) => {
				switch (type) {
					case "textarea":
						return (
							<VStack space={space}>
								<FormControl isRequired={required} isDisabled={disabled}>
									{renderLabel()}
									<Textarea>
										<TextareaInput
											value={field.value}
											onChangeText={field.onChange}
											placeholder={placeholder}
											maxLength={maxlength}
										/>
									</Textarea>
								</FormControl>
							</VStack>
						);

					case "checkbox":
						if (!options?.length) {
							return (
								<VStack space={space}>
									<FormControl isDisabled={disabled}>
										<Checkbox
											size={size}
											isChecked={!!field.value}
											onChange={(checked) => field.onChange(checked)}
										>
											<CheckboxIndicator className="mr-2">
												<CheckboxIcon as={CheckIcon} />
											</CheckboxIndicator>
											<CheckboxLabel aria-label={label}>{label}</CheckboxLabel>
										</Checkbox>
									</FormControl>
								</VStack>
							);
						}

						return (
							<VStack space={space}>
								<FormControl isDisabled={disabled}>
									{label && (
										<FormControlLabel>
											<FormControlLabelText aria-label={label}>{label}</FormControlLabelText>
										</FormControlLabel>
									)}
									<CheckboxGroup
										value={field.value || []}
										onChange={(keys) => field.onChange(keys)}
									>
										<VStack space="xl">
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
								</FormControl>
							</VStack>
						);

					case "radio":
						return (
							<VStack space={space}>
								<FormControl>
									{renderLabel()}
									<RadioGroup value={field.value || value || ""} onChange={field.onChange}>
										<VStack space={space}>
											{options.map((option) => (
												<Radio
													key={option.value}
													id={`${fieldName}-${option.value}`}
													size="sm"
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
								</FormControl>
							</VStack>
						);

					case "select":
						return (
							<VStack space={space}>
								<FormControl>
									{renderLabel()}
									<Select
										onValueChange={field.onChange}
										selectedValue={options.find((option) => option.value === value)?.text}
									>
										<SelectTrigger variant="outline" size="md">
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
								</FormControl>
							</VStack>
						);

					case "range":
						return (
							<VStack space={space}>
								<FormControl isRequired={required} isDisabled={disabled}>
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
								</FormControl>
							</VStack>
						);

					case "password":
						const [showPassword, setShowPassword] = React.useState(false);
						return (
							<VStack space={space}>
								<FormControl isRequired={required} isDisabled={disabled}>
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
								</FormControl>
							</VStack>
						);

					case "date":
						return "";

					default:
						return (
							<VStack space={space}>
								<FormControl isRequired={required} isDisabled={disabled}>
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
										/>
									</Input>
								</FormControl>
							</VStack>
						);
				}
			}}
		/>
	);
};
