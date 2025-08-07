import React from "react";
import { Model } from "@decaf-ts/decorator-validation";
import { RenderingEngine } from "@decaf-ts/ui-decorators";

type ReactNativeDynamicOutput = {
	component: React.ComponentType<any>;
	props: Record<string, any>;
	children?: ReactNativeDynamicOutput[];
};

export class ReactNativeRenderingEngine extends RenderingEngine {
	private _model!: Model;

	constructor() {
		super("react-native");
	}

	initialize(...args: any[]): any {
		if (this.initialized) return;
		this.initialized = true;
	}

	render<M extends Model>(model: M, globalProps: Record<string, unknown> = {}): any {
		let result: any;
		try {
			this._model = model;
			result = this.toFieldDefinition(model, globalProps);
		} catch (e: unknown) {
			throw new Error(`Failed to render Model ${model.constructor.name}: ${e}`);
		}

		return result;
	}
}
