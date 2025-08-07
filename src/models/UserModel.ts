import {
	minlength,
	Model,
	model,
	ModelArg,
	password,
	required,
} from "@decaf-ts/decorator-validation";
import { uielement, uilistitem, uimodel } from "@decaf-ts/ui-decorators";

@uilistitem("ngx-decaf-list-item", { icon: "cafe-outline" })
@uimodel("ngx-decaf-crud-form")
@model()
export class UserModel extends Model {
	@required()
	@minlength(3)
	@uielement("ngx-decaf-crud-field", {
		label: "user.username.label",
	})
	username!: string;

	@required()
	@password()
	@uielement("ngx-decaf-crud-field", { label: "user.secret.label" })
	secret!: string;

	constructor(args: ModelArg<UserModel> = {}) {
		super(args);
		Model.fromObject(this, args);
	}
}
