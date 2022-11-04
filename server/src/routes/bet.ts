import { FastifyInstance } from "fastify"
import { z } from "zod"

import { prisma } from "../lib/prisma"
import { authenticate } from "../plugins/authenticate"

export async function betRoutes(fastify: FastifyInstance) {
  fastify.get('/bets/count', async () => {
    const count = await prisma.poll.count()

    return { count }
  })

  fastify.post('/polls/:pollId/matches/:matchId/bets', { onRequest: [authenticate] }, async (request, reply) => {
    const createBetParams = z.object({
      pollId: z.string(),
      matchId: z.string(),
    })

    const createBetBody = z.object({
      firstTeamPoints: z.number(),
      secondTeamPoints: z.number(),
    })

    const { pollId, matchId } = createBetParams.parse(request.params)
    const { firstTeamPoints, secondTeamPoints } = createBetBody.parse(request.body)

    const participant = await prisma.participant.findUnique({
      where: {
        userId_pollId: {
          pollId,
          userId: request.user.sub
        }
      }
    })

    if (!participant) {
      return reply.status(400).send({ message: 'You are not allowed to create bet inside this poll.' })
    }

    const bet = await prisma.bet.findUnique({
      where: {
        participantId_matchId: {
          participantId: participant.id,
          matchId
        }
      }
    })

    if (bet) {
      return reply.status(400).send({ message: 'You already created a bet for this match on this poll.' })
    }

    const match = await prisma.match.findUnique({
      where: {
        id: matchId
      }
    })

    if (!match) {
      return reply.status(404).send({ message: 'Match not found.' })
    }

    if (match.date < new Date()) {
      return reply.status(400).send({ message: 'You cannot submit bets after the match has started.' })
    }

    await prisma.bet.create({
      data: {
        matchId,
        participantId: participant.id,
        firstTeamPoints,
        secondTeamPoints
      }
    })

    return reply.status(201).send({ message: 'Bet created.' })
  })
}