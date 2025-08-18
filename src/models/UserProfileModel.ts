import {
	date,
	email,
	model,
	Model,
	ModelArg,
	password,
	pattern,
	required,
	minlength,
	maxlength,
	min,
} from "@decaf-ts/decorator-validation";
import { uichild, uielement, uimodel } from "@decaf-ts/ui-decorators";
import { ProfessionalInfoModel } from "./ProfessionalInfoModel";
import { AddressModel } from "./AddressModel";

@uimodel("ngx-decaf-crud-form")
@model()
export class UserProfileModel extends Model {
	@required()
	@minlength(5)
	@maxlength(36)
	@uielement("ngx-decaf-crud-field", {
		label: "Full Name",
	})
	fullName!: string;

	@required()
	@date("yyyy-MM-dd")
	@uielement("ngx-decaf-crud-field", {
		label: "Birth Date",
		displayType: "range",
	})
	birthDate!: Date;

	@required()
	@min(20)
	@uielement("ngx-decaf-crud-field", {
		label: "Age",
		displayType: "range",
	})
	age!: number;

	@required()
	@email()
	@uielement("ngx-decaf-crud-field", {
		label: "Email",
		placeholder: "your@email.com",
	})
	email!: string;

	@required()
	@password()
	@uielement("ngx-decaf-crud-field", {
		label: "Password",
		type: "password",
	})
	password!: string;

	@required()
	@pattern(/^\(\d{2}\) \d{4,5}-\d{4}$/)
	@uielement("ngx-decaf-crud-field", {
		label: "Phone",
	})
	phone!: string;

	@required()
	@uielement("ngx-decaf-crud-field", {
		label: "Gender",
		type: "radio",
		options: [
			{ value: "male", text: "Male" },
			{ value: "female", text: "Female" },
		],
	})
	gender!: string;

	@uichild(AddressModel.name, "ngx-decaf-fieldset")
	address!: AddressModel;

	@uichild(ProfessionalInfoModel.name, "ngx-decaf-fieldset")
	professionalInfo!: ProfessionalInfoModel;

	@required()
	@uielement("ngx-decaf-crud-field", {
		label: "Accept terms and conditions",
		displayType: "checkbox",
	})
	acceptTerms!: boolean;

	constructor(arg?: ModelArg<UserProfileModel>) {
		super(arg);
	}
}
