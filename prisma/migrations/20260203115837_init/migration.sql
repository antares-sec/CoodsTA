/*
  Warnings:

  - Added the required column `identificationResult` to the `Identifications` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "IdentificationResult" AS ENUM ('GENUINE', 'COUNTERFEIT');

-- AlterTable
ALTER TABLE "Identifications" ADD COLUMN     "identificationResult" "IdentificationResult" NOT NULL;
