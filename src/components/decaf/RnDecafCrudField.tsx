import React, { useEffect } from "react";
import { FormControl, FormControlLabel, FormControlLabelText } from "@components/ui/form-control";
import { VStack } from "@components/ui/vstack";
import { Input, InputField, InputIcon, InputSlot } from "@components/ui/input";
import { Text } from "@components/ui/text";
import { CrudOperations, OperationKeys } from "@decaf-ts/db-decorators";
import { Textarea, TextareaInput } from "@components/ui/textarea";
import {
	Checkbox,
	CheckboxGroup,
	CheckboxIcon,
	CheckboxIndicator,
	CheckboxLabel,
} from "@components/ui/checkbox";
import { CheckIcon, ChevronDownIcon, CircleIcon, EyeIcon, EyeOffIcon } from "@components/ui/icon";
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
import { Slider, SliderFilledTrack, SliderThumb, SliderTrack } from "@components/ui/slider";
import { useFormContext } from "react-hook-form";

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
	checked?: boolean;
	size?: "sm" | "md" | "lg";
	mask?: string;
	pattern?: string;

	onChange?: (value: any) => void;
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
	checked,
	onChange,
	...props
}) => {
	const readOnly = [OperationKeys.READ, OperationKeys.DELETE].includes(operation);
	const disabled = readonly || readOnly;

	const formFieldName = props.path;
	const { register, setValue, watch } = useFormContext();
	const handleValue = watch(formFieldName);

	const handleChange = (v: any) => {
		setValue(formFieldName, v);
	};
	useEffect(() => {
		register(formFieldName);
	}, [register, formFieldName]);

	console.log("Label=", label, "type=", type, "props=", props);
	switch (type) {
		case "textarea":
			return (
				<VStack space="sm">
					<FormControl
						isInvalid={false}
						size={props.size || "md"}
						isDisabled={disabled}
						isReadOnly={readOnly}
						isRequired={required}
					>
						<FormControlLabel>
							<FormControlLabelText aria-label={label}>{label}</FormControlLabelText>
						</FormControlLabel>
						<Textarea className="min-w-[350px]">
							<TextareaInput
								value={handleValue}
								onChangeText={handleChange}
								placeholder={placeholder}
								maxLength={maxlength}
							/>
						</Textarea>
					</FormControl>
				</VStack>
			);

		case "checkbox":
			return options.length > 0 ? (
				<VStack space="sm">
					<FormControl>
						<FormControlLabel>
							<FormControlLabelText aria-label={label}>{label}</FormControlLabelText>
						</FormControlLabel>
						<CheckboxGroup
							value={handleValue}
							onChange={(keys) => {
								handleChange(keys);
								onChange?.(keys);
							}}
						>
							<VStack space="sm">
								{options.map((option) => (
									<Checkbox key={option.value} size="sm" value={option.value}>
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
			) : (
				<VStack space="sm">
					<FormControl>
						<CheckboxGroup
							value={handleValue}
							onChange={(keys) => {
								handleChange(keys);
								onChange?.(keys.includes("checked"));
							}}
						>
							<Checkbox size="sm">
								<CheckboxIndicator className="mr-2">
									<CheckboxIcon as={CheckIcon} />
								</CheckboxIndicator>
								<CheckboxLabel aria-label={label}>{label}</CheckboxLabel>
							</Checkbox>
						</CheckboxGroup>
					</FormControl>
				</VStack>
			);

		case "radio":
			return (
				<VStack space="sm">
					<FormControl>
						<FormControlLabel>
							<FormControlLabelText aria-label={label}>{label}</FormControlLabelText>
						</FormControlLabel>
						<RadioGroup value={handleValue} onChange={handleChange}>
							<VStack space="sm">
								{options.map((option) => (
									<Radio key={option.value} size="sm" value={option.value}>
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
				<VStack space="sm">
					<FormControl>
						<FormControlLabel>
							<FormControlLabelText aria-label={label}>{label}</FormControlLabelText>
						</FormControlLabel>
						<Select onValueChange={handleChange} defaultValue={handleValue}>
							<SelectTrigger variant="outline" size="md">
								<SelectInput placeholder={placeholder || "Select option"} />
								<SelectIcon className="mr-3" as={ChevronDownIcon} />
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
											isDisabled={option.disabled || false}
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
				<VStack space="sm">
					<FormControl>
						<FormControlLabel>
							<FormControlLabelText aria-label={label}>
								{label}: {handleValue}
							</FormControlLabelText>
						</FormControlLabel>
						<Slider
							minValue={min || 0}
							maxValue={max || 100}
							step={1}
							value={handleValue}
							onChange={handleChange}
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

		case "date":
			return (
				<input
					type="date"
					value={handleValue}
					onChange={(e) => handleChange(e.target.value)}
					style={{ padding: 8, borderWidth: 1, borderColor: "#ccc", borderRadius: 6 }}
				/>
			);

		case "password":
			const [showPassword, setShowPassword] = React.useState(false);
			const handleState = () => {
				setShowPassword((showState) => {
					return !showState;
				});
			};
			return (
				<FormControl>
					<VStack space="xl">
						<VStack space="xs">
							<Text aria-label={label}>{label}</Text>
							<Input className="text-center">
								<InputField type={showPassword ? "text" : "password"} />
								<InputSlot className="pr-3" onPress={handleState}>
									<InputIcon as={showPassword ? EyeIcon : EyeOffIcon} />
								</InputSlot>
							</Input>
						</VStack>
					</VStack>
				</FormControl>
			);

		default:
			return (
				<VStack space="sm">
					<FormControl
						isInvalid={false}
						size={props.size || "md"}
						isDisabled={disabled}
						isReadOnly={readOnly}
						isRequired={required}
					>
						<FormControlLabel>
							<FormControlLabelText aria-label={label}>{label}</FormControlLabelText>
						</FormControlLabel>
						<Input size={props.size || "md"}>
							<InputField
								type={type}
								keyboardType={type === "number" ? "number-pad" : "default"}
								placeholder={placeholder}
								value={handleValue}
								minLength={minlength}
								maxLength={maxlength}
								min={min}
								max={max}
								onChangeText={handleChange}
							/>
						</Input>
					</FormControl>
				</VStack>
			);
	}
};
