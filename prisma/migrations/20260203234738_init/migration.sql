/*
  Warnings:

  - You are about to drop the column `result` on the `Identifications` table. All the data in the column will be lost.
  - Added the required column `authenticityResult` to the `Identifications` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Identifications" DROP COLUMN "result",
ADD COLUMN     "authenticityResult" "IdentificationResult" NOT NULL;
