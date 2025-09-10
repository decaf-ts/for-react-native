import { FieldValues, useForm, UseFormReturn } from "react-hook-form";
import { PARENT_TOKEN, tokenizePath, } from "./utils";
import { ValidatorFactory } from "./ValidationFactory";
import { ControlFieldProps, RnDecafCrudFieldProps } from "./types";
import { escapeHtml, HTML5CheckTypes, HTML5InputTypes, parseToNumber } from "@decaf-ts/ui-decorators";

/**
 * @description Service class to manage form state, controls, and validations across nested forms.
 * @summary The `RnFormService` class centralizes form management using `react-hook-form`. It allows for registering, retrieving, and validating controls across parent and child forms. This service also provides utilities for handling form data, including parsing and sanitization of values, while maintaining a registry for easy lookup and control sharing across different components.
 *
 * @param {string} formId - The unique identifier for the form.
 * @param {RnFormService} [parent] - Optional reference to the parent form service, if the form is nested.
 *
 * @class
 *
 * @example
 * ```ts
 * const rootForm = new RnFormService("mainForm");
 * const childForm = rootForm.addChild("address");
 * childForm.addFormControl({
 *   name: "street",
 *   type: "text",
 *   path: "address.street",
 * });
 *
 * const values = rootForm.getParsedData();
 * console.log(values.address.street);
 * ```
 *
 * @mermaid
 * sequenceDiagram
 *   participant U as User
 *   participant F as RnFormService
 *   participant R as Registry
 *   participant RHF as ReactHookForm
 *
 *   U->>F: Instantiate RnFormService(formId)
 *   F->>RHF: Initialize form methods
 *   U->>F: addFormControl(props)
 *   F->>F: Create validator and controlProps
 *   F->>R: Register control in form registry
 *   U->>F: getParsedData()
 *   F->>F: Traverse controls and parse values
 *   F->>U: Return sanitized form data
 */
export class RnFormService {
	/**
	 * @description React Hook Form methods for managing form state and actions.
	 * @summary Holds the RHF API (`useForm`) that provides form control, submission, reset, and value management utilities.
	 */
	private readonly formMethods: UseFormReturn<FieldValues, any, FieldValues>;

	/**
	 * @description Map of controls registered in this form.
	 * @summary Contains both field controls and nested `RnFormService` instances representing child forms.
	 */
	private controls: Map<string, ControlFieldProps | RnFormService> = new Map();

	/**
	 * @description Reference to the parent form service if this form is nested.
	 * @summary Enables hierarchical navigation and retrieval of form controls between parent and child forms.
	 */
	readonly _parent: RnFormService | undefined;

	constructor(
		private readonly formId: string,
		parent?: RnFormService
	) {
		this._parent = parent;
		this.formMethods = parent ? parent.getMethods() : useForm();
	}

	/**
	 * @description Retrieves a registered control or child form by its path.
	 * @summary Traverses through the tokenized path to return either a field control or a nested form. Supports resolving parent references.
	 * @param {string} path - The dot-separated path to the control.
	 * @return {ControlFieldProps | RnFormService | undefined} The control or form service if found, otherwise `undefined`.
	 */
	getControl(path: string): ControlFieldProps | RnFormService | undefined {
		const steps = tokenizePath(path);
		if (steps.length === 0) return undefined;

		let current: RnFormService | undefined = this;
		for (let i = 0; i < steps.length; i++) {
			const step = steps[i];

			if (step === PARENT_TOKEN) {
				if (!current?._parent) return undefined;
				current = current._parent;
				continue;
			}

			const control: ControlFieldProps | RnFormService | undefined = current!.controls.get(step);
			if (!control) return undefined;

			// If it's the last segment, return whatever was found
			if (i === steps.length - 1) return control;

			if (control instanceof RnFormService) {
				current = control;
			}
		}

		return undefined;
	}

	/**
	 * @description Validate and submits the form.
	 * @summary Executes the `react-hook-form` submission handler and logs submitted data.
	 * @return {void}
	 */
	submit() {
		this.formMethods.handleSubmit(
			(data) => {
				console.log("Submit=", this.getParsedData());
			},
			() => {
				console.log("Invalid form=", this.getValues());
			}
		)();
	}

	/**
	 * @description Resets the form to its initial state.
	 * @summary Calls `reset` from `react-hook-form` to clear all values and errors.
	 * @return {void}
	 */
	reset() {
		this.formMethods.reset();
	}

	/**
	 * @description Retrieves form values.
	 * @summary Returns all values if no path is provided, otherwise retrieves nested values based on the given dot-separated path.
	 * @param {string} [path] - Optional path string to a specific value.
	 * @return {any} The full form values or the specific value if path is provided.
	 */
	getValues(path?: string): any {
		const values = this.formMethods.getValues();
		if (!path) return values;

		return path.split(".").reduce((acc, key) => {
			return acc && typeof acc === "object" ? acc[key] : undefined;
		}, values);
	}

	/**
	 * @description Retrieves parsed form data.
	 * @summary Iterates through registered controls and child forms to build a structured object of form data. It also parses values based on input types (e.g., number, date) and sanitizes strings.
	 * @return {Record<string, unknown>} An object containing the parsed and sanitized form data.
	 */
	getParsedData(): Record<string, unknown> {
		const form = this;
		const data: Record<string, unknown> = {};
		for (const key of form.controls.keys()) {
			const props = form.controls.get(key)!;
			if (props instanceof RnFormService) {
				data[key] = props.getParsedData();
				continue;
			}

			let value: any = this.getValues(props.path);
			if (!HTML5CheckTypes.includes(props.type)) {
				switch (props.type) {
					case HTML5InputTypes.NUMBER:
						value = parseToNumber(value);
						break;
					case HTML5InputTypes.DATE:
					case HTML5InputTypes.DATETIME_LOCAL:
						value = new Date(value);
						break;
					default:
						value = escapeHtml(value);
				}
			}
			data[key] = value;
		}

		return data;
	}

	/**
	 * @description Returns the internal `react-hook-form` methods.
	 * @summary Provides direct access to the RHF API for advanced usage.
	 * @return {UseFormReturn<FieldValues, any, FieldValues>} The `useForm` methods instance.
	 */
	getMethods() {
		return this.formMethods;
	}

	/**
	 * @description Constructs a form ID path string.
	 * @summary Concatenates a `renderId` with an optional path using dot notation.
	 * @param {string} renderId - The base form render ID.
	 * @param {string} [path] - Optional child path.
	 * @return {string} The concatenated form ID path.
	 */
	static mountFormIdPath(renderId: string, path?: string) {
		return path ? [renderId, path].join(".") : renderId;
	}

	/**
	 * @description Splits a formId into its base id and path.
	 * @summary Extracts the root form ID and the remaining path segments.
	 * @param {string} formId - The full form ID path.
	 * @return {{ formId: string, path: string }} An object containing the base formId and the derived path.
	 */
	static getFormIdPath(formId: string) {
		const parts = formId.split(".");
		const _formId = parts.shift() as string;
		const path = parts.join(".");
		return { formId: _formId, path };
	}

	/**
	 * @description Gets this form's ID path.
	 * @summary Uses `RnFormService.getFormIdPath` to extract structured form ID information for the current form.
	 * @return {{ formId: string, path: string }} The form ID and its path.
	 */
	getFormIdPath() {
		return RnFormService.getFormIdPath(this.formId);
	}

	/**
	 * @description Adds a nested child form.
	 * @summary Traverses or creates a hierarchy of child forms and registers them with the form registry.
	 * @param {string} path - Dot-separated path for the child form to be created or retrieved.
	 * @return {RnFormService} The nested child form service.
	 */
	addChild(path: string): RnFormService {
		const parts = path.split(".");
		let currentForm: RnFormService = this;
		let formId = this.getFormIdPath().formId;

		for (const part of parts) {
			formId += `.${part}`; // RnFormService.makeFormIdPath(formId, part); //`.${part}`;

			if (RnFormService.has(formId)) {
				currentForm = RnFormService.get(formId);
				continue;
			}

			const childForm = new RnFormService(formId, currentForm);
			RnFormService.addRegistry(childForm);
			currentForm.controls.set(part, childForm as any);
			currentForm = childForm;
		}

		return currentForm;
	}

	/**
	 * @description Adds a control to the form.
	 * @summary Registers a new control with validators into the current form or a nested child form, based on the `childOf` property.
	 * @param {RnDecafCrudFieldProps} props - Field configuration including validation and metadata.
	 * @return {ControlFieldProps} The registered control properties.
	 */
	addFormControl(props: RnDecafCrudFieldProps): ControlFieldProps {
		const { name, childOf } = props;
		if (childOf && this.getFormIdPath().path !== childOf) {
			const f = this.addChild(childOf);
			return f.addFormControl(props);
		}

		const controlProps: Partial<ControlFieldProps> = { formProvider: this };
		const validatorProps: ControlFieldProps = Object.assign({}, props, controlProps) as ControlFieldProps;

		const validator = ValidatorFactory.validatorsFromProps(validatorProps);
		const fieldProps: ControlFieldProps = { ...validatorProps, validateFn: validator };

		this.controls.set(name, fieldProps);
		return fieldProps;
	}

	/**
	 * @description Validates fields of a form.
	 * @summary Checks if a form with the given ID exists in the registry, returning true if it is valid.
	 * @param {string} formId - The ID of the form to validate.
	 * @return {boolean} `true` if the form exists, otherwise `false`.
	 */
	static validateFields(formId: string): boolean {
		const formMethods = this.formRegistry.get(formId);
		if (!formMethods) return false;
		return true;
	}

	private static formRegistry = new Map<string, RnFormService>();

	/**
	 * @description Adds a form service instance to the registry.
	 * @summary Ensures a unique form ID is registered and accessible globally.
	 * @param {RnFormService} form - The form service instance to register.
	 * @return {void}
	 */
	static addRegistry(form: RnFormService) {
		if (this.formRegistry.has(form.formId)) throw new Error(`A form with id '${form.formId}' is already registered.`);
		this.formRegistry.set(form.formId, form);
	}

	/**
	 * @description Removes a form from the registry.
	 * @summary Deletes the form with the given ID from the static registry.
	 * @param {string} formId - The ID of the form to remove.
	 * @return {void}
	 */
	static removeRegistry(formId: string) {
		this.formRegistry.delete(formId);
	}

	/**
	 * @description Retrieves or creates a form by its ID.
	 * @summary Looks up the form in the registry; if not found, creates and registers a new instance, resolving parent forms if necessary.
	 * @param {string} id - The form ID path.
	 * @return {RnFormService} The found or newly created form service instance.
	 */
	static get(id: string): RnFormService {
		if (!this.has(id)) {
			const { formId, path } = RnFormService.getFormIdPath(id);
			let parent: RnFormService | undefined = undefined;
			if (path) {
				const parentPath = path.split(".").slice(0, -1).join(".");
				const parentFormId = RnFormService.mountFormIdPath(formId, parentPath);
				parent = RnFormService.has(parentFormId) ? RnFormService.get(parentFormId) : undefined; // avoid circular call
			}
			const f = new RnFormService(id, parent);
			this.addRegistry(f);
		}

		return this.formRegistry.get(id) as RnFormService;
	}

	/**
	 * @description Checks if a form exists in the registry.
	 * @summary Returns whether a form with the given ID is registered.
	 * @param {string} formId - The form ID to check.
	 * @return {boolean} `true` if the form exists in the registry, otherwise `false`.
	 */
	static has(formId: string): boolean {
		return this.formRegistry.has(formId);
	}
}
