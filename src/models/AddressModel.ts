import { uielement, uimodel } from "@decaf-ts/ui-decorators";
import { Model, model, required } from "@decaf-ts/decorator-validation";

@uimodel("ngx-decaf-crud-form")
@model()
export class AddressModel extends Model {
	@required()
	@uielement("ngx-decaf-crud-field", {
		label: "Address",
		placeholder: "Street/Avenue",
	})
	street!: string;

	@required()
	@uielement("ngx-decaf-crud-field", {
		label: "Number",
	})
	number!: number;

	@uielement("ngx-decaf-crud-field", {
		label: "Complement",
	})
	complement?: string;

	@required()
	@uielement("ngx-decaf-crud-field", {
		label: "ZIP Code",
		mask: "00000-000",
	})
	zipCode!: string;

	@required()
	@uielement("ngx-decaf-crud-field", {
		label: "City",
	})
	city!: string;

	@required()
	@uielement("ngx-decaf-crud-field", {
		label: "State",
		type: "select",
		options: [
			{ value: "MH", text: "Maharashtra" },
			{ value: "BV", text: "Bavaria" },
			{ value: "QL", text: "Queensland" },
		],
	})
	state!: string;

	constructor(args: Partial<AddressModel>) {
		super();
		Model.fromObject(this, args);
	}
}
