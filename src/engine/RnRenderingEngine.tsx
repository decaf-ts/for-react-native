import React from "react";
import { Model } from "@decaf-ts/decorator-validation";
import { FieldDefinition, RenderingEngine } from "@decaf-ts/ui-decorators";
import { ComponentRegistry } from "@/src/engine/ComponentRegistry";
import { ValidatorFactory } from "@/src/validation";

export type RnFieldDefinition = FieldDefinition & {
	validateFn?: (value: any) => string | undefined;
};

export class RnRenderingEngine extends RenderingEngine {
	constructor() {
		super("react-native");
	}

	initialize(...args: any[]): any {
		if (this.initialized) return;
		this.initialized = true;
	}

	private fromFieldDefinition(def: RnFieldDefinition): React.ReactNode {
		const rendererId = def.rendererId || Math.random().toString(36).replace(".", "");
		const { tag, props, children } = def;
		const Component = ComponentRegistry.get(tag);
		if (!Component) {
			console.warn(`Component ${def.tag} not found`);
			return null;
		}

		const childrenComponents = children?.map((child, i) => {
			return this.fromFieldDefinition({
				...child,
				rendererId: child.rendererId || `${rendererId}-${child.props.path || i}`,
			});
		});

		const validator = ValidatorFactory.validatorsFromProps(props);
		const componentProps: Record<string, any> = Object.assign({}, props, {
			validateFn: validator,
		});
		return (
			<Component key={def.rendererId} {...componentProps}>
				{childrenComponents}
			</Component>
		);
	}

	render<M extends Model>(model: M, globalProps: Record<string, unknown> = {}): any {
		try {
			const def = this.toFieldDefinition(model, globalProps);
			console.log("DEF=", def);
			return this.fromFieldDefinition(def);
		} catch (e: unknown) {
			throw new Error(`Failed to render Model ${model.constructor.name}: ${e}`);
		}
	}
}
