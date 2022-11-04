/*
  Warnings:

  - A unique constraint covering the columns `[participantId,matchId]` on the table `Bet` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Bet_participantId_matchId_key" ON "Bet"("participantId", "matchId");
