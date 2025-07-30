import EditScreenInfo from "@/components/EditScreenInfo";
import { Center } from "@/components/ui/center";
import { Divider } from "@/components/ui/divider";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { model } from "@decaf-ts/decorator-validation";

@model()
export class MD {
  constructor() {
  }
}

export default function Tab2() {
  return (
    <Center className="flex-1">
      <Heading className="font-bold text-2xl">Example - Tab1</Heading>
      <Divider className="my-[30px] w-[80%]" />
      <Text className="p-4">Tabs example for-react-native.</Text>
      <EditScreenInfo path="app/(app)/(tabs)/tab1.tsx" />
    </Center>
  );
}
