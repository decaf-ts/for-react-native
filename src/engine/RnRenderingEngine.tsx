import React from "react";
import { Model } from "@decaf-ts/decorator-validation";
import { FieldDefinition, RenderingEngine } from "@decaf-ts/ui-decorators";
import { ComponentRegistry } from "@/src/engine/ComponentRegistry";
import { ValidatorFactory } from "@/src/engine/validation";
import { FieldValues, FormProvider, useForm, UseFormReturn } from "react-hook-form";
import { StyleSheet } from "react-native";
import { Button, ButtonText } from "@components/ui/button";
import { HStack } from "@components/ui/hstack";
import { VStack } from "@components/ui/vstack";
import { Heading } from "@components/ui/heading";

export type RnFieldDefinition = FieldDefinition & {
	validateFn?: (value: any) => string | undefined;
};

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

	private fromFieldDefinition(
		formMethods: UseFormReturn<FieldValues, any, FieldValues>,
		def: RnFieldDefinition
	): React.ReactNode {
		const rendererId = def.rendererId || Math.random().toString(36).replace(".", "");
		const { tag, props, children } = def;
		const Component = ComponentRegistry.get(tag);
		if (!Component) {
			console.warn(`Component ${def.tag} not found`);
			return null;
		}

		const childrenComponents = children?.map((child, i) => {
			return this.fromFieldDefinition(formMethods, {
				...child,
				rendererId: child.rendererId || `${rendererId}-${child.props.path || i}`,
			});
		});

		const { control } = formMethods;
		const validator = ValidatorFactory.validatorsFromProps(formMethods, props);
		const componentProps: Record<string, any> = Object.assign({}, props, {
			validateFn: validator,
			control,
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
			const RenderingForm = () => {
				const methods = useForm();
				return (
					<FormProvider {...methods}>
						<VStack space="md">
							{this.fromFieldDefinition(methods, def)}
							<HStack space="sm" style={styles.footer}>
								<Button style={styles.button} onPress={() => methods.reset()}>
									<ButtonText>Cancel</ButtonText>
								</Button>
								<Button
									style={styles.button}
									onPress={methods.handleSubmit((data) => console.log("Submit:", data))}
								>
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
