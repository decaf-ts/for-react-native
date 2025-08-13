import {
	date,
	email,
	model,
	Model,
	ModelArg,
	password,
	pattern,
	required,
} from "@decaf-ts/decorator-validation";
import { uichild, uielement, uimodel } from "@decaf-ts/ui-decorators";
import { ProfessionalInfoModel } from "./ProfessionalInfoModel";
import { AddressModel } from "./AddressModel";

@uimodel("ngx-decaf-crud-form")
@model()
export class UserProfileModel extends Model {
	@required()
	@uielement("ngx-decaf-crud-field", {
		label: "Full Name",
	})
	fullName!: string;

	@required()
	@date("yyyy-MM-dd")
	@uielement("ngx-decaf-crud-field", {
		label: "Birth Date",
		type: "range",
	})
	birthDate!: Date;

	@required()
	@uielement("ngx-decaf-crud-field", {
		label: "Age",
		type: "range",
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
		mask: "(00) 00000-0000",
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
		type: "checkbox",
	})
	acceptTerms!: boolean;

	constructor(arg?: ModelArg<UserProfileModel>) {
		super(arg);
	}
}
