import { useState } from "react";
import { Heading, VStack } from "native-base";
import { useNavigation } from "@react-navigation/native";

import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { Button } from "../components/Button";

import { api } from "../lib/axios";
import { toast } from "../lib/toast";

export function Find() {
  const { navigate } = useNavigation();

  const [isLoadingPoll, setIsLoadingPoll] = useState(false);
  const [code, setCode] = useState('');

  async function handleJoinPoll() {
    try {
      setIsLoadingPoll(true)
      
      if (!code.trim()) {
        return toast.error('Informe o código do bolão');
      }

      await api.post(`/polls/join`, { code });
      toast.success('Bolão entrou no bolão com sucesso');
      navigate('polls');

    } catch (error) {
      console.log(error)
      setIsLoadingPoll(false)

      if (error.response?.data?.message === 'Poll not found.') {
        return toast.error('Não foi possível encontrar o bolão')
      } 
      
      if (error.response?.data?.message === 'You already joined this poll.') {
        return toast.error('Você já está participando deste bolão')
      }

      toast.error('Não foi possível encontrar o bolão')
    }
  }

  return (
    <VStack flex="1" bgColor="gray.900">
      <Header title="Buscar por código" showBackButton />

      <VStack mt="8" mx="5" alignItems="center">
        <Heading
          fontFamily="heading"
          color="white"
          fontSize="xl"
          mb="8"
          textAlign="center"
        >
          Encontre um bolão através de seu código único
        </Heading>

        <Input
          placeholder="Qual o código do bolão?"
          mb="2"
          autoCapitalize="characters"
          onChangeText={setCode}
        />

        <Button
          title="BUSCAR BOLÃO"
          isLoading={isLoadingPoll}
          onPress={handleJoinPoll}
        />
      </VStack>
    </VStack>
  )
}