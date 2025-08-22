import { uichild, uielement, uimodel } from "@decaf-ts/ui-decorators";
import { Model, model, required, diff } from "@decaf-ts/decorator-validation";
import { AddressModel } from "./AddressModel";

@uimodel("ngx-decaf-crud-form")
@model()
export class ProfessionalInfoModel extends Model {
	@required()
	@uielement("ngx-decaf-crud-field", {
		label: "Position",
		inputType: "select",
		options: [
			{ value: 1, text: "Developer" },
			{ value: 2, text: "Manager" },
			{ value: 3, text: "Designer" },
			{ value: 0, text: "Other" },
		],
	})
	position!: number;

	@required()
	@diff("../specialization")
	@uielement("ngx-decaf-crud-field", {
		label: "Specialization",
		inputType: "radio",
		options: [
			{ value: "frontend", text: "Front-end" },
			{ value: "backend", text: "Back-end" },
			{ value: "fullstack", text: "Full-stack" },
			{ value: "mobile", text: "Mobile" },
		],
	})
	specialization?: string;

	@required()
	@uielement("ngx-decaf-crud-field", {
		label: "Company",
	})
	company!: string;

	@uielement("ngx-decaf-crud-field", {
		label: "Job Description",
		inputType: "textarea",
	})
	jobDescription?: string;

	@uielement("ngx-decaf-crud-field", {
		label: "Available for",
		inputType: "checkbox",
		options: [
			{ value: "fulltime", text: "Full-time" },
			{ value: "parttime", text: "Part-time" },
		],
	})
	availableToJobType?: string;

	@uichild(AddressModel.name, "ngx-decaf-fieldset")
	companyAddress!: AddressModel;

	constructor(args: Partial<ProfessionalInfoModel>) {
		super();
		Model.fromObject(this, args);
	}
}
