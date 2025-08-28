import React from "react";
import { Model } from "@decaf-ts/decorator-validation";
import { FieldDefinition, RenderingEngine } from "@decaf-ts/ui-decorators";
import { ComponentRegistry } from "@/src/engine/ComponentRegistry";
import { FormProvider } from "react-hook-form";
import { StyleSheet } from "react-native";
import { Button, ButtonText } from "@components/ui/button";
import { HStack } from "@components/ui/hstack";
import { VStack } from "@components/ui/vstack";
import { Heading } from "@components/ui/heading";
import { RnFormService } from "@/src/engine/RnFormService";
import { ControlFieldProps, RnDecafCrudFieldProps } from "@/src/engine/types";

// export type RnFieldDefinition = FieldDefinition & {
// 	validateFn?: (value: any) => string | undefined;
// };

const styles = StyleSheet.create({
	footer: {
		marginTop: 10,
		marginBottom: 20,
		gap: 10,
	},
	button: {
		flex: 1,
	},
});

export class RnRenderingEngine extends RenderingEngine {
	constructor() {
		super("react-native");
	}

	initialize(...args: any[]): any {
		if (this.initialized) return;
		this.initialized = true;
	}

	private fromFieldDefinition(def: FieldDefinition<any>): React.ReactNode {
		const rendererId = def.rendererId || Math.random().toString(36).replace(".", "");
		const form = RnFormService.get(rendererId);

		let componentProps: RnDecafCrudFieldProps | ControlFieldProps = def.props;
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
			return this.fromFieldDefinition({
				...child,
				rendererId: rendererId, // child.rendererId || `${rendererId}-${child.props.path || i}`,
			});
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
			console.log("toFieldDefinition=", def);
			const RenderingForm = () => {
				const component = this.fromFieldDefinition(def);
				const methods = RnFormService.get(def.rendererId!).getMethods();

				return (
					<FormProvider {...methods}>
						<VStack space="md">
							{component}
							<HStack space="sm" style={styles.footer}>
								<Button style={styles.button} onPress={() => methods.reset()}>
									<ButtonText>Cancel</ButtonText>
								</Button>
								<Button style={styles.button} onPress={methods.handleSubmit((data) => console.log("Submit:", data))}>
									<ButtonText>Submit</ButtonText>
								</Button>
							</HStack>
						</VStack>
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
