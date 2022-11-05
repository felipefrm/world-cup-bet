import { Icon, VStack } from "native-base";
import { Octicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import { Button } from "../components/Button";
import { Header } from "../components/Header";

export function Polls() {
  const { navigate } = useNavigation();

  return (
    <VStack flex="1" bgColor="gray.900">
      <Header title="Meus bolões" />

      <VStack
        mt="6" mb="4" mx="5" pb="4"
        borderBottomColor="gray.600"
        borderBottomWidth="1"
      >
        <Button
          title="BUSCAR BOLÃO POR CÓDIGO"
          leftIcon={<Icon as={Octicons} name="search" color="black" size="md" />}
          onPress={() => navigate('find')}
        />
      </VStack>
    </VStack>
  )
}