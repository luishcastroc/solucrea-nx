/*
  Warnings:

  - You are about to drop the column `modalidadDeSeguroId` on the `Creditos` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Creditos` DROP FOREIGN KEY `Creditos_modalidadDeSeguroId_fkey`;

-- AlterTable
ALTER TABLE `Creditos` DROP COLUMN `modalidadDeSeguroId`;
