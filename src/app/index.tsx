import React from "react";
import { Image, View } from "react-native";
import Gradient from "@/assets/Icons/Gradient";
import { Box } from "@components/ui/box";
import { Text } from "@components/ui/text";
import { Link } from "expo-router";

export default function Home() {
  return (
    <Box className="flex-1 bg-black h-[100vh] items-center justify-center">
      {/* Background Gradient */}
      <Box className="absolute h-[500px] w-[500px] opacity-10">
        <Gradient />
      </Box>

      {/* Logo */}
      <Box className="mb-12">
        <Image
          source={require("@/assets/images/decaf/decaf-logo-w.svg")}
          style={{ width: 180, height: 180 }}
          resizeMode="contain"
        />
      </Box>

      {/* Welcome Text */}
      <Box className="mb-10 px-8 items-center">
        <Text className="text-white text-3xl font-light mb-2">welcome to</Text>
        <Text className="text-white text-3xl font-bold mb-1">DECAF</Text>
        <Text className="text-gray-400 text-sm font-light">
          for react native
        </Text>
        {/* Gradient line */}
        <View
          style={{
            height: 4,
            width: 120,
            marginTop: 12,
            backgroundImage: "linear-gradient(to right, #141414, #FF00FF)",
            borderRadius: 2,
          }}
        />
      </Box>

      {/* Start Button */}
      <Link href="/tabs" asChild>
        <Box
          className="py-3 px-8 rounded-full"
          style={{
            backgroundColor: "#141414",
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
            cursor: "pointer",
          }}
        >
          <Text className="text-white font-medium text-base">start</Text>
        </Box>
      </Link>
    </Box>
  );
}
