import { FieldValues, useForm, useFormContext, UseFormReturn } from "react-hook-form";
import { ControlFieldProps, RnDecafCrudFieldProps } from "@/src/engine/types";
import { ValidatorFactory } from "@/src/engine/validation";
import { escapeHtml, HTML5CheckTypes, HTML5InputTypes, parseToNumber } from "@decaf-ts/ui-decorators";

type FieldProperties = {
	name: string;
	path?: string;
	childOf?: string;
	children?: FieldProperties[];
	[key: string]: any;
};

export class RnFormService {
	private readonly formMethods: UseFormReturn<FieldValues, any, FieldValues>;
	private controls: Map<string, ControlFieldProps | RnFormService> = new Map();
	readonly _parent: RnFormService | undefined;

	constructor(
		private readonly formId: string,
		parent?: RnFormService
	) {
		this.formMethods = useForm();
		this._parent = parent;
	}

	submit() {
		this.formMethods.handleSubmit((data) => {
			console.log("Submit=", data);
		})();
	}

	reset() {
		this.formMethods.reset();
	}

	getFormData(): Record<string, unknown> {
		const form = this;
		const data: Record<string, unknown> = {};
		for (const key of form.controls.keys()) {
			const props = form.controls.get(key)!;
			if (props instanceof RnFormService) {
				data[key] = props.getFormData();
				continue;
			}

			let value: any = props.value;
			if (!HTML5CheckTypes.includes(props.type)) {
				switch (props.type) {
					case HTML5InputTypes.NUMBER:
						value = parseToNumber(value as any);
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

		console.log("getFormData=", data);
		console.log("getValues=", this.formMethods.getValues());
		return data;
	}

	getMethods() {
		return this.formMethods;
	}

	static makeFormIdPath(renderId: string, path?: string) {
		return path ? [renderId, path].join(".") : renderId;
	}

	static getFormIdPath(formId: string) {
		const parts = formId.split(".");
		const _formId = parts.shift() as string;
		const path = parts.join(".");
		return { formId: _formId, path };
	}

	getFormIdPath() {
		return RnFormService.getFormIdPath(this.formId);
	}

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
			console.log("currentForm=", "path:", path, "->", part);
			currentForm.controls.set(part, childForm as any);
			currentForm = childForm;
		}

		return currentForm;
	}

	getContext() {
		return useFormContext();
	}

	/**
	 * Creates or finds a form in registry and adds a new field config.
	 * Also recursively registers children.
	 */
	addFormControl(props: RnDecafCrudFieldProps): ControlFieldProps {
		const { name, childOf } = props;
		if (childOf && this.getFormIdPath().path !== childOf) {
			const f = this.addChild(childOf);
			return f.addFormControl(props);
		}

		const validatorProps: ControlFieldProps = Object.assign({}, props, {
			form: this,
			control: this.formMethods.control,
		});

		const validator = ValidatorFactory.validatorsFromProps(this.formMethods, validatorProps);
		const fieldProps = { ...validatorProps, validateFn: validator };

		this.controls.set(name, fieldProps);
		return fieldProps;
	}

	/**
	 * Retrieves a control from a registered form (just returns path and config in RHF, no real control obj).
	 * Throws if not found.
	 */
	static getControlFromForm(formId: string, path?: string): FieldProperties | undefined {
		if (!this.formRegistry.has(formId)) throw new Error(`Form with id '${formId}' not found in the registry.`);
		if (!path) return undefined;
		return this.controls.get(path);
	}

	/**
	 * Retorna os dados do formulário.
	 */
	// static getFormData(formId: string): Record<string, unknown> {
	// 	const formMethods = this.formRegistry.get(formId);
	// 	if (!formMethods) return {};
	// 	return formMethods.getValues();
	// }

	static validateFields(formId: string): boolean {
		const formMethods = this.formRegistry.get(formId);
		if (!formMethods) return false;
		// Em RHF, validação dispara via handleSubmit; aqui apenas proxy
		return true;
	}

	static register() {}
	static unregister() {}
	static getParentEl() {}

	private static formRegistry = new Map<string, RnFormService>();
	private static controls = new Map<string, FieldProperties>();

	/**
	 * Retorna propriedades do campo salvo (FieldProperties).
	 */
	static getPropsFromControl(path: string): FieldProperties {
		return this.controls.get(path) || ({} as any);
	}

	/**
	 * Adds a form to the registry.
	 */
	static addRegistry(form: RnFormService) {
		if (this.formRegistry.has(form.formId)) throw new Error(`A form with id '${form.formId}' is already registered.`);
		this.formRegistry.set(form.formId, form);
	}

	/**
	 * Removes a form from the registry.
	 */
	static removeRegistry(formId: string) {
		this.formRegistry.delete(formId);
	}

	static get(id: string): RnFormService {
		if (!this.has(id)) {
			const { formId, path } = RnFormService.getFormIdPath(id);
			let parent: RnFormService | undefined = undefined;
			if (path) {
				const parentPath = path.split(".").slice(0, -1).join(".");
				const parentFormId = RnFormService.makeFormIdPath(formId, parentPath);
				parent = RnFormService.has(parentFormId) ? RnFormService.get(parentFormId) : undefined; // avoid circular call
			}
			const f = new RnFormService(id, parent);
			this.addRegistry(f);
		}

		return this.formRegistry.get(id) as RnFormService;
	}

	static has(formId: string): boolean {
		return this.formRegistry.has(formId);
	}
}
