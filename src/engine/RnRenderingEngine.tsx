import React from "react";
import { Model } from "@decaf-ts/decorator-validation";
import { FieldDefinition, RenderingEngine } from "@decaf-ts/ui-decorators";
import { ComponentRegistry, ControlFieldProps, RnDecafCrudFieldProps, RnFormService } from "@engine";
import { FormProvider } from "react-hook-form";
import { HStack } from "@components/ui/hstack";
import { VStack } from "@components/ui/vstack";
import { Heading } from "@components/ui/heading";

/**
 * @description Rendering engine specialized for React Native form components.
 * @summary The `RnRenderingEngine` extends the base `RenderingEngine` to provide functionality for rendering form models using React Native components. It integrates with the `RnFormService` to manage form state, maps model definitions to UI components, and provides nested rendering of form fields and child components.
 *
 * @param {...any[]} args - Arguments passed to the base rendering engine during initialization.
 *
 * @class
 *
 * @example
 * ```tsx
 * import { RnRenderingEngine } from "./RnRenderingEngine";
 * import { UserModel } from "./UserModel";
 *
 * const engine = new RnRenderingEngine();
 * const userModel = new UserModel();
 *
 * export const App = () => {
 *   return engine.render(userModel, { someProp: "value" });
 * };
 * ```
 *
 * @mermaid
 * sequenceDiagram
 *   participant U as User
 *   participant E as RnRenderingEngine
 *   participant F as RnFormService
 *   participant R as React
 *
 *   U->>E: render(model, globalProps)
 *   E->>E: toFieldDefinition(model, globalProps)
 *   E->>E: fromFieldDefinition(def)
 *   E->>F: RnFormService.get(rendererId)
 *   E->>R: Create React Component tree
 *   R->>U: Rendered React Native Form
 */
export class RnRenderingEngine extends RenderingEngine {
	constructor() {
		super("react-native");
	}

	initialize(...args: any[]): any {
		if (this.initialized) return;
		this.initialized = true;
	}

	/**
	 * @description Converts a `FieldDefinition` into a React element.
	 * @summary Maps a field definition into a registered React component by retrieving the component from `ComponentRegistry`, attaching control props, registering children with `RnFormService`, and recursively rendering child components.
	 * @param {FieldDefinition<RnDecafCrudFieldProps>} def - The field definition containing metadata, props, and children.
	 * @return {React.ReactNode} The rendered React element for the field, or `null` if no component is found.
	 */
	private fromFieldDefinition(def: FieldDefinition<RnDecafCrudFieldProps>): React.ReactNode {
		const rendererId = def.rendererId || Math.random().toString(36).replace(".", "");
		const form = RnFormService.get(rendererId);

		let componentProps: RnDecafCrudFieldProps | ControlFieldProps = { ...def.props, formProvider: form };
		if (def.props?.path) {
			componentProps = form.addFormControl(def.props);
		}

		const { tag, children } = def;
		const Component = ComponentRegistry.get(tag);
		if (!Component) {
			console.warn(`Component ${def.tag} not found`);
			return null;
		}

		const childrenComponents = children?.map((child, i) => {
			if (child.props.childOf) form.addChild(child.props.childOf);

			const { formId } = form.getFormIdPath();
			return this.fromFieldDefinition({
				...child,
				rendererId: RnFormService.mountFormIdPath(formId, child.props.childOf),
			});
		});

		return (
			<Component key={[rendererId, componentProps.path || componentProps.name || ""].join(".")} {...componentProps}>
				{childrenComponents}
			</Component>
		);
	}

	/**
	 * @description Renders a given model into React form components.
	 * @summary Transforms a `Model` into a field definition, constructs React form components, and provides context via `FormProvider` from `react-hook-form`. Falls back to an error UI if rendering fails.
	 * @template M - The type of model being rendered, extending `Model`.
	 * @param {M} model - The model instance to render.
	 * @param {Record<string, unknown>} [globalProps={}] - Optional global props passed into the rendering process.
	 * @return {any} A React element representing the rendered form.
	 */
	render<M extends Model>(model: M, globalProps: Record<string, unknown> = {}): any {
		try {
			const def = this.toFieldDefinition(model, globalProps);
			console.log("toFieldDefinition=", def);
			const RenderingForm = () => {
				const component = this.fromFieldDefinition(def);
				const form = RnFormService.get(def.rendererId!);
				const methods = form.getMethods();
				return (
					<FormProvider {...methods}>
						<VStack space="md">{component}</VStack>
					</FormProvider>
				);
			};

			return <RenderingForm />;
		} catch (e: unknown) {
			console.error(e);
			return (
				<HStack space="sm">
					<Heading>Failed to render Model "{model.constructor.name}"</Heading>
				</HStack>
			);
		}
	}
}
