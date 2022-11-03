import Image from 'next/image'
import appPreviewImg from '../assets/app-nlw-copa-preview.png';
import logoImg from '../assets/logo.svg';
import userAvatarExampleImg from '../assets/users-avatar-example.png';
import iconCheckImg from '../assets/icon-check.svg';
import { api } from '../lib/axios';
import { FormEvent, useState } from 'react';

interface HomeProps {
  pollCount: number;
  betCount: number;
  userCount: number;
}

export default function Home({ pollCount, betCount, userCount }: HomeProps) {
  const [pollName, setPollName] = useState('');

  async function handleCreatePoll(event: FormEvent) {
    event.preventDefault();

    try {
      const response = await api.post('/polls', { title: pollName })
      const { code } = response.data;

      navigator.clipboard.writeText(code);

      alert('Bolão criado com sucesso, o código foi copiado para a área de transferência!');
      setPollName('');
    } catch (error) {
      console.log(error)
      alert('Falha ao criar o bolão, tente novamente!');
    }
  }

  return (
    <div className="max-w-[1124px] h-screen mx-auto grid grid-cols-2 gap-28 items-center">
      <main>
        <Image src={logoImg} alt="NlW Copa" />

        <h1 className="mt-14 text-white text-5xl font-bold leading-tight">
          Crie seu próprio bolão da copa e compartilhe entre amigos!
        </h1>

        <div className="mt-10 flex items-center gap-2">
          <Image src={userAvatarExampleImg} alt="" />
          <strong className="text-gray-100 text-xl">
            <span className='text-green-500'>+{userCount}</span> pessoas já estão usando
          </strong>
        </div>

        <form onSubmit={handleCreatePoll} className="mt-10 flex gap-2">
          <input
            className="flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-gray-100"
            type="text"
            required
            placeholder='Qual o nome do seu bolão'
            onChange={(event) => setPollName(event.target.value)}
            value={pollName}
          />
          <button
            className="px-6 py-4 rounded bg-yellow-500 text-gray-900 font-bold text-sm uppercase hover:opacity-70 transition-opacity"
            type="submit"
          >
            Criar meu bolão
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-300 leading-relaxed">Após criar seu bolão, você receberá um código único que poderá usar para convidar outras pessoas 🚀</p>

        <div className='mt-10 pt-10 border-t border-gray-600 flex items-center justify-between text-gray-100'>
          <div className="flex items-center gap-6">
            <Image src={iconCheckImg} alt="" />
            <div className="flex flex-col">
              <span className="font-bold text-2xl">+{pollCount}</span>
              <span>Bolões criados</span>
            </div>
          </div>

          <div className="w-px h-14 bg-gray-600"></div>

          <div className="flex items-center gap-6">
            <Image src={iconCheckImg} alt="" />
            <div className="flex flex-col">
              <span className="font-bold text-2xl">+{betCount}</span>
              <span>Palpites enviados</span>
            </div>
          </div>
        </div>
      </main>

      <Image
        src={appPreviewImg}
        alt="Dois celulares exibindo uma prévia da aplicação móvel do NLW Copa"
        quality={100}
      />
    </div>
  )
}

export const getServerSideProps = async () => {
  const [pollCountResponse, betCountResponse, userCountResponse] = await Promise.all([
    api.get('polls/count'),
    api.get('bets/count'),
    api.get('users/count')
  ])

  return {
    props: {
      pollCount: pollCountResponse.data.count,
      betCount: betCountResponse.data.count,
      userCount: userCountResponse.data.count
    }
  }
}
