type RenderComponent = React.ComponentType<any>;

/**
 * @description Registry class for managing dynamic React components.
 * @summary The `ComponentRegistry` provides a static store for React components keyed by a string tag.
 * It allows registering components at runtime and retrieving them later, enabling dynamic rendering
 * strategies (e.g., rendering components from JSON configs or CMS-driven schemas).
 *
 * @class
 *
 * @example
 * ```tsx
 * import { ComponentRegistry } from "./ComponentRegistry";
 *
 * // Define components
 * const Button = () => <button>Click</button>;
 * const Input = () => <input />;
 *
 * // Register components
 * ComponentRegistry.register("button", Button);
 * ComponentRegistry.register("input", Input);
 *
 * // Retrieve and render dynamically
 * const Tag = "button";
 * const Comp = ComponentRegistry.get(Tag);
 *
 * export default function App() {
 *   return (
 *     <div>
 *       {Comp ? <Comp /> : <p>Unknown component</p>}
 *     </div>
 *   );
 * }
 * ```
 *
 * @mermaid
 * sequenceDiagram
 *   participant U as User
 *   participant CR as ComponentRegistry
 *   participant R as React
 *
 *   U->>CR: register("button", Button)
 *   CR->>CR: store component in Map
 *   U->>CR: get("button")
 *   CR->>U: returns Button component
 *   U->>R: render <Button />
 */
export class ComponentRegistry {
	private static components = new Map<string, RenderComponent>();

	static register(tag: string, comp: RenderComponent) {
		this.components.set(tag, comp);
		return comp;
	}

	static get(tag: string): RenderComponent | undefined {
		const comp = this.components.get(tag);
		if (!comp) console.warn(`Component "${tag}" not found on registry.`);
		return comp;
	}
}

// export function component(tag: string) {
// 	return function <T extends React.ComponentType<any>>(comp: T) {
// 		ComponentRegistry.register(tag, comp);
// 		return comp;
// 	};
// }