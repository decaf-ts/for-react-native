import React from "react";
import { Model } from "@decaf-ts/decorator-validation";
import { FieldDefinition, RenderingEngine } from "@decaf-ts/ui-decorators";
import { ComponentRegistry } from "@/src/engine/ComponentRegistry";

export class RnRenderingEngine extends RenderingEngine {
	private _model!: Model;

	constructor() {
		super("react-native");
	}

	initialize(...args: any[]): any {
		if (this.initialized) return;
		this.initialized = true;
	}

	private fromFieldDefinition(def: FieldDefinition): React.ReactNode {
		const { tag, rendererId, props, children } = def;
		const Component = ComponentRegistry.get(tag);
		if (!Component) {
			console.warn(`Component ${def.tag} not found`);
			return null;
		}

		const childrenComponents = children?.map((child, i) =>
			this.fromFieldDefinition({ ...child, rendererId: child.rendererId || `${rendererId}-${i}` })
		);

		return (
			<Component key={def.rendererId} {...(props as Record<string, any>)}>
				{childrenComponents}
			</Component>
		);
	}

	render<M extends Model>(model: M, globalProps: Record<string, unknown> = {}): any {
		try {
			this._model = model;
			const def = this.toFieldDefinition(model, globalProps);
			console.log("toFieldDefinition=", def);
			return this.fromFieldDefinition(def);
		} catch (e: unknown) {
			throw new Error(`Failed to render Model ${model.constructor.name}: ${e}`);
		}
	}
}
