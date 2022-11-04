import { FastifyInstance } from "fastify"
import { z } from "zod"

import { prisma } from "../lib/prisma"
import { authenticate } from "../plugins/authenticate"

export async function matchRoutes(fastify: FastifyInstance) {
  fastify.get('/polls/:id/matches', { onRequest: [authenticate] }, async (request) => {
    const getPollParams = z.object({
      id: z.string(),
    })

    const { id } = getPollParams.parse(request.params)

    const matches = await prisma.match.findMany({
      orderBy: {
        date: 'desc'
      },
      include: {
        bets: {
          where: {
            participant: {
              userId: request.user.sub,
              pollId: id
            }
          }
        }
      }
    })

    return { 
      matches: matches.map(match => ({
        ...match,
        bet: match.bets.length > 0 ? match.bets[0] : null,
        bets: undefined
      })) 
    }
  })
}