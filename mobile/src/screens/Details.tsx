import { useEffect, useState } from "react";
import { Share } from "react-native";
import { HStack, VStack } from "native-base";
import { useRoute } from "@react-navigation/native";

import { Header } from "../components/Header";
import { Loading } from "../components/Loading";
import { PollCardProps } from "../components/PollCard";

import { api } from "../lib/axios";
import { toast } from "../lib/toast";
import { PollHeader } from "../components/PollHeader";
import { EmptyMyPollList } from "../components/EmptyMyPollList";
import { Option } from "../components/Option";

interface RouteParams {
  id: string;
}

export function Details() {
  const [isLoadingPoll, setIsLoadingPoll] = useState(true);
  const [poll, setPoll] = useState<PollCardProps>({} as PollCardProps);
  const [optionSelected, setOptionSelected] = useState<'bets' | 'ranking'>('bets');


  const route = useRoute();

  const { id } = route.params as RouteParams;

  async function fetchPollDetails() {
    try {
      setIsLoadingPoll(true);

      const response = await api.get(`/polls/${id}`);

      setPoll(response.data.poll)
    } catch (error) {
      console.log(error)
      toast.error('Não foi possível carregar os detalhes do bolão')
    } finally {
      setIsLoadingPoll(false);
    }
  }

  async function handleCodeShare() {
    await Share.share({ message: poll.code })
  }

  useEffect(() => {
    fetchPollDetails();
  }, [id])

  if (isLoadingPoll) {
    return <Loading />;
  }

  return (
    <VStack flex="1" bgColor="gray.900">
      <Header
        title={poll.title}
        showBackButton
        showShareButton
        onShare={handleCodeShare}
      />

      {
        poll._count?.participants > 0 ? (
          <VStack px={5} flex="1">
            <PollHeader data={poll} />

            <HStack bgColor="gray.800" p="1" rounded="sm" mb="5">
              <Option
                title="Seus palpites"
                isSelected={optionSelected === 'bets'}
                onPress={() => setOptionSelected('bets')}
              />
              <Option
                title="Ranking do grupo"
                isSelected={optionSelected === 'ranking'}
                onPress={() => setOptionSelected('ranking')}
              />
            </HStack>
          </VStack>
        ) : <EmptyMyPollList code={poll.code} />
      }

    </VStack>
  )
}