import { uichild, uielement, uimodel } from "@decaf-ts/ui-decorators";
import { diff, model, Model, required } from "@decaf-ts/decorator-validation";
import { AddressModel } from "./AddressModel";

@uimodel("ngx-decaf-crud-form")
@model()
export class ProfessionalInfoModel extends Model {
	@required()
	@uielement("ngx-decaf-crud-field", {
		label: "professionalInfo.position.label",
		inputType: "select",
		options: [
			{ value: 1, text: "professionalInfo.position.options.1" },
			{ value: 2, text: "professionalInfo.position.options.2" },
			{ value: 3, text: "professionalInfo.position.options.3" },
			{ value: 0, text: "professionalInfo.position.options.0" },
		],
	})
	position!: number;

	@required()
	@diff("../specialization")
	@uielement("ngx-decaf-crud-field", {
		label: "professionalInfo.specialization.label",
		inputType: "radio",
		options: [
			{ value: "frontend", text: "professionalInfo.specialization.options.frontend" },
			{ value: "backend", text: "professionalInfo.specialization.options.backend" },
			{ value: "fullstack", text: "professionalInfo.specialization.options.fullstack" },
			{ value: "mobile", text: "professionalInfo.specialization.options.mobile" },
		],
	})
	specialization?: string;

	@required()
	@uielement("ngx-decaf-crud-field", {
		label: "professionalInfo.company.label",
	})
	company!: string;

	@uielement("ngx-decaf-crud-field", {
		label: "professionalInfo.jobDescription.label",
		inputType: "textarea",
	})
	jobDescription?: string;

	@uielement("ngx-decaf-crud-field", {
		label: "professionalInfo.availableToJobType.label",
		inputType: "checkbox",
		options: [
			{ value: "fulltime", text: "professionalInfo.availableToJobType.options.fulltime" },
			{ value: "parttime", text: "professionalInfo.availableToJobType.options.parttime" },
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
