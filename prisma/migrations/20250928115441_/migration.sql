/*
  Warnings:

  - You are about to drop the column `playListId` on the `ProblemInPlayList` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[playlistId,problemId]` on the table `ProblemInPlayList` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `playlistId` to the `ProblemInPlayList` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."ProblemInPlayList" DROP CONSTRAINT "ProblemInPlayList_playListId_fkey";

-- DropIndex
DROP INDEX "public"."ProblemInPlayList_playListId_problemId_key";

-- AlterTable
ALTER TABLE "public"."ProblemInPlayList" DROP COLUMN "playListId",
ADD COLUMN     "playlistId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ProblemInPlayList_playlistId_problemId_key" ON "public"."ProblemInPlayList"("playlistId", "problemId");

-- AddForeignKey
ALTER TABLE "public"."ProblemInPlayList" ADD CONSTRAINT "ProblemInPlayList_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "public"."Playlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;
