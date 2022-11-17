import { memo } from "react";

import { VStack, Text, StackProps } from "@chakra-ui/react";

export const ErrorFallback = memo(function ErrorFallback(props: StackProps) {
  return (
    <VStack spacing={1} p={3} justifyContent="center" {...props}>
      <Text as="h2" fontSize="5xl">
        Uh oh
      </Text>
      <Text as="p" fontSize="xl">
        Something unexpected happened. Please try again.
      </Text>
    </VStack>
  );
});
