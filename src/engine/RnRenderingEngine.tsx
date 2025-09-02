import React from "react";
import { Model } from "@decaf-ts/decorator-validation";
import { FieldDefinition, RenderingEngine } from "@decaf-ts/ui-decorators";
import { ComponentRegistry } from "@/src/engine/ComponentRegistry";
import { FormProvider } from "react-hook-form";
import { HStack } from "@components/ui/hstack";
import { VStack } from "@components/ui/vstack";
import { RnFormService } from "@/src/engine/RnFormService";
import { ControlFieldProps, RnDecafCrudFieldProps } from "@/src/engine/types";
import { Heading } from "@components/ui/heading";

export class RnRenderingEngine extends RenderingEngine {
	constructor() {
		super("react-native");
	}

	initialize(...args: any[]): any {
		if (this.initialized) return;
		this.initialized = true;
	}

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
				rendererId: RnFormService.makeFormIdPath(formId, child.props.childOf),
			});
		});

		return (
			<Component key={[rendererId, componentProps.name || ""].join(".")} {...componentProps}>
				{childrenComponents}
			</Component>
		);
	}

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
