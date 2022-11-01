import { Center, Text } from "native-base";
import { StatusBar } from 'expo-status-bar';

export function SignIn() {
  return (
    <Center flex={1} bgColor="gray.300">
      <Text color="white">Sign In</Text>
    </Center>
  )
}