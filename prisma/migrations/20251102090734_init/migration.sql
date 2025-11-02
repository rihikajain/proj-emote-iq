/*
  Warnings:

  - You are about to drop the `Entry` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Reflection` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `email` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."Entry" DROP CONSTRAINT "Entry_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Reflection" DROP CONSTRAINT "Reflection_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "password" TEXT NOT NULL,
ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "email" SET NOT NULL;

-- DropTable
DROP TABLE "public"."Entry";

-- DropTable
DROP TABLE "public"."Reflection";

-- CreateTable
CREATE TABLE "MoodEntry" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "mood" TEXT NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MoodEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmotionTag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "EmotionTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_MoodEntryEmotionTags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_MoodEntryEmotionTags_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "EmotionTag_name_key" ON "EmotionTag"("name");

-- CreateIndex
CREATE INDEX "_MoodEntryEmotionTags_B_index" ON "_MoodEntryEmotionTags"("B");

-- AddForeignKey
ALTER TABLE "MoodEntry" ADD CONSTRAINT "MoodEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MoodEntryEmotionTags" ADD CONSTRAINT "_MoodEntryEmotionTags_A_fkey" FOREIGN KEY ("A") REFERENCES "EmotionTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MoodEntryEmotionTags" ADD CONSTRAINT "_MoodEntryEmotionTags_B_fkey" FOREIGN KEY ("B") REFERENCES "MoodEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;
