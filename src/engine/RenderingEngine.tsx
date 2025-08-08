import React from "react";
import { Model } from "@decaf-ts/decorator-validation";
import { RenderingEngine } from "@decaf-ts/ui-decorators";
import { ComponentRegistry } from "@/src/engine/ComponentRegistry";

export class ReactNativeRenderingEngine extends RenderingEngine {
	private _model!: Model;

	constructor() {
		super("react-native");
	}

	initialize(...args: any[]): any {
		if (this.initialized) return;
		this.initialized = true;
	}

	private fromFieldDefinition(node: any): React.ReactNode {
		const Component = ComponentRegistry.get(node.tag);
		if (!Component) {
			console.warn(`Componente não encontrado para tag: ${node.tag}`);
			return null;
		}

		const children = node.children?.map((child: any, i: number) =>
			this.fromFieldDefinition({ ...child, key: i })
		);

		console.log("render=", node.props);

		return (
			<Component key={node.key} {...node.props} {...node.item}>
				{children}
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
