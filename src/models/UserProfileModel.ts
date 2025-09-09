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
	eq,
	diff,
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
		label: "user.fullName.label",
	})
	fullName!: string;

	@required()
	@minlength(5)
	@maxlength(36)
	@eq("./fullName", { label: "Full Name" })
	@uielement("ngx-decaf-crud-field", {
		label: "user.legalName.label",
	})
	legalName!: string;

	@required()
	@date("yyyy-MM-dd")
	@uielement("ngx-decaf-crud-field", {
		label: "user.birthDate.label",
	})
	birthDate!: Date;

	@required()
	@min(20)
	@uielement("ngx-decaf-crud-field", {
		label: "user.age.label",
		inputType: "range",
	})
	age!: number;

	@required()
	@email()
	@uielement("ngx-decaf-crud-field", {
		label: "user.email.label",
		placeholder: "your@email.com",
	})
	email!: string;

	@required()
	@password()
	@uielement("ngx-decaf-crud-field", {
		label: "user.password.label",
		inputType: "password",
	})
	password!: string;

	@required()
	@pattern(/^\(\d{2}\) \d{4,5}-\d{4}$/)
	@uielement("ngx-decaf-crud-field", {
		label: "user.phone.label",
	})
	phone!: string;

	@required()
	@uielement("ngx-decaf-crud-field", {
		label: "user.gender.label",
		inputType: "radio",
		options: [
			{ value: "male", text: "user.gender.options.male" },
			{ value: "female", text: "user.gender.options.female" },
		],
	})
	gender!: string;

	@uichild(AddressModel.name, "ngx-decaf-fieldset")
	address!: AddressModel;

	@required()
	@diff("professionalInfo.specialization")
	@uielement("ngx-decaf-crud-field", {
		label: "user.specialization.label",
	})
	specialization?: string = "Frontend";

	@uichild(ProfessionalInfoModel.name, "ngx-decaf-fieldset")
	professionalInfo!: ProfessionalInfoModel;

	@required()
	@uielement("ngx-decaf-crud-field", {
		label: "user.acceptTerms.label",
		inputType: "checkbox",
	})
	acceptTerms!: boolean;

	constructor(arg?: ModelArg<UserProfileModel>) {
		super(arg);
	}
}
