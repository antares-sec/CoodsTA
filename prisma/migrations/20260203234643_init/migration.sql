/*
  Warnings:

  - You are about to drop the column `identificationResult` on the `Identifications` table. All the data in the column will be lost.
  - Added the required column `confidenceScore` to the `Identifications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productId` to the `Identifications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `result` to the `Identifications` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ModelActive" AS ENUM ('ACTIVE', 'DEACTIVATED');

-- CreateEnum
CREATE TYPE "ModelType" AS ENUM ('DETECTOR', 'CLASSIFICATOR');

-- AlterTable
ALTER TABLE "Identifications" DROP COLUMN "identificationResult",
ADD COLUMN     "confidenceScore" INTEGER NOT NULL,
ADD COLUMN     "productId" TEXT NOT NULL,
ADD COLUMN     "result" "IdentificationResult" NOT NULL;

-- CreateTable
CREATE TABLE "Model" (
    "id" TEXT NOT NULL,
    "modelType" "ModelType" NOT NULL,
    "version" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "accuracy" INTEGER NOT NULL,
    "deploymentDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" "ModelActive" NOT NULL,

    CONSTRAINT "Model_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Identifications" ADD CONSTRAINT "Identifications_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
