import { Component } from "react";

type ComponentConstructor = new () => Component;
type RenderComponent = React.ComponentType<any>;

export class ComponentRegistry {
	private static components = new Map<string, RenderComponent>();

	static register(name: string, component: RenderComponent) {
		this.components.set(name, component);
	}

	static get(name: string): RenderComponent | undefined {
		return this.components.get(name);
	}

	// private static components = new Map<string, ComponentConstructor>();
	//
	// static register(name: string, ctor: ComponentConstructor) {
	// 	if (this.components.has(name)) {
	// 		console.warn(`Component "${name}" already registered.`);
	// 	}
	// 	this.components.set(name, ctor);
	// }
	//
	// static get(name: string): Component {
	// 	const ctor = this.components.get(name);
	// 	if (!ctor) {
	// 		throw new Error(`Component "${name}" not found on registry.`);
	// 	}
	// 	return new ctor();
	// }
}

// export function component(name: string) {
// 	return function <T extends { new (...args: any[]): Component }>(ctor: T) {
// 		ComponentRegistry.register(name, ctor);
// 	};
// }

export function component(tag: string) {
	return function <T extends React.ComponentType<any>>(component: T) {
		ComponentRegistry.register(tag, component);
		return component;
	};
}
