import { uielement, uimodel } from "@decaf-ts/ui-decorators";
import { Model, model, required } from "@decaf-ts/decorator-validation";

@uimodel("ngx-decaf-crud-form")
@model()
export class AddressModel extends Model {
	@required()
	@uielement("ngx-decaf-crud-field", {
		label: "address.street.label",
		placeholder: "Street/Avenue",
	})
	street!: string;

	@required()
	@uielement("ngx-decaf-crud-field", {
		label: "address.number.label",
	})
	number!: number;

	@uielement("ngx-decaf-crud-field", {
		label: "address.complement.label",
	})
	complement?: string;

	@required()
	@uielement("ngx-decaf-crud-field", {
		label: "address.zipCode.label",
	})
	zipCode!: string;

	@required()
	@uielement("ngx-decaf-crud-field", {
		label: "address.city.label",
	})
	city!: string;

	@required()
	@uielement("ngx-decaf-crud-field", {
		label: "address.street.label",
		inputType: "select",
		options: [
			{ value: "MH", text: "address.state.options.MH" },
			{ value: "BV", text: "address.state.options.BV" },
			{ value: "QL", text: "address.state.options.QL" },
		],
	})
	state!: string;

	constructor(args: Partial<AddressModel>) {
		super();
		Model.fromObject(this, args);
	}
}
