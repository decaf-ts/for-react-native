import React from "react";
import { Box } from "@components/ui/box";
import { Text } from "@components/ui/text";

export default function EditScreenInfo({ path }: { path: string }) {
	return (
		<Box>
			<Box className="items-center mx-4">
				<Box className="rounded-sm px-1 my-2 bg-secondary-200">
					<Text className="text-sm leading-5 text-center font-SpaceMono">{path}</Text>
				</Box>
			</Box>
		</Box>
	);
}
