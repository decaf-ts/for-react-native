import { uichild, uielement, uimodel } from "@decaf-ts/ui-decorators";
import { Model, model, required } from "@decaf-ts/decorator-validation";
import { AddressModel } from "./AddressModel";

@uimodel("ngx-decaf-crud-form")
@model()
export class ProfessionalInfoModel extends Model {
	@required()
	@uielement("ngx-decaf-crud-field", {
		label: "Position",
		type: "select",
		options: [
			{ value: "dev", text: "Developer" },
			{ value: "manager", text: "Manager" },
			{ value: "designer", text: "Designer" },
			{ value: "other", text: "Other" },
		],
	})
	position!: string;

	@uielement("ngx-decaf-crud-field", {
		label: "Specialization",
		type: "radio",
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
		type: "textarea",
	})
	jobDescription?: string;

	@uichild(AddressModel.name, "ngx-decaf-fieldset")
	companyAddress!: AddressModel;

	constructor(args: Partial<ProfessionalInfoModel>) {
		super();
		Model.fromObject(this, args);
	}
}
