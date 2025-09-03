export const PARENT_TOKEN = "../";

export function tokenizePath(path: string): string[] {
	path = path.trim();
	path = path.startsWith("./") ? path.slice(2) : path;
	if (!path) return [];
	// Match "../" tokens OR runs of non-dot characters.
	// This yields clean segments without empty strings from consecutive dots.
	const tokens = path.match(/(\.\.\/)|[^.]+/g);
	return tokens ?? [];
}
