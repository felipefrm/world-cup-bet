import { useCallback, useEffect, useState } from "react";
import { FlatList, Icon, VStack } from "native-base";
import { Octicons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

import { api } from "../lib/axios";
import { toast } from "../lib/toast";

import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { Loading } from "../components/Loading";
import { PollCard, PollCardProps } from "../components/PollCard";
import { EmptyPollList } from "../components/EmptyPollList";

export function Polls() {
  const { navigate } = useNavigation();

  const [polls, setPolls] = useState<PollCardProps[]>([]);
  const [isLoadingPolls, setIsLoadingPolls] = useState(true);

  async function fetchPolls() {
    try {
      setIsLoadingPolls(true);
      const response = await api.get('/polls');
      setPolls(response.data.polls);
    } catch (error) {
      console.log(error)
      toast.error('Não foi possível carregar os bolões')
    } finally {
      setIsLoadingPolls(false);
    }
  }

  useFocusEffect(useCallback(() => {
    fetchPolls();
  }, []));

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
      {isLoadingPolls ? <Loading /> :
        <FlatList
          data={polls}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <PollCard
              data={item}
              onPress={() => navigate('details', { id: item.id })}
            />
          )}
          ListEmptyComponent={() => <EmptyPollList />}
          showsVerticalScrollIndicator={false}
          _contentContainerStyle={{ paddingBottom: 10 }}
          px="5"
        />
      }
    </VStack>
  )
}