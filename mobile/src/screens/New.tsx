import { Heading, Text, VStack } from "native-base";

import { api } from "../lib/axios";

import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { Button } from "../components/Button";

import Logo from '../assets/logo.svg';
import { useState } from "react";
import { toast } from "../lib/toast";

export function New() {
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handlePollCreate() {
    if (!title.trim()) {
      return toast.error('Informe um nome para o seu bolão')
    }

    try {
      setIsLoading(true);
      await api.post('/polls', { title })
      toast.success('Bolão criado com sucesso!')
      setTitle('');
    } catch (error) {
      console.log(error)
      toast.error('Não foi possível criar o bolão')
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <VStack flex="1" bgColor="gray.900">
      <Header title="Criar novo bolão" />

      <VStack mt="8" mx="5" alignItems="center">
        <Logo />

        <Heading
          fontFamily="heading"
          color="white"
          fontSize="xl"
          my="8"
          textAlign="center"
        >
          Crie seu próprio bolão da copa{'\n'}e compartilhe entre amigos!
        </Heading>

        <Input
          placeholder="Qual o nome do seu bolão?"
          mb="2"
          onChangeText={setTitle}
          value={title}
        />

        <Button
          title="CRIAR MEU BOLÃO"
          onPress={handlePollCreate}
          isLoading={isLoading}
        />

        <Text color="gray.200" fontSize="sm" textAlign="center" px="10" mt="4">
          Após criar seu bolão, você receberá um código único
          que poderá usar para convidar outras pessoas.
        </Text>
      </VStack>
    </VStack>
  )
}