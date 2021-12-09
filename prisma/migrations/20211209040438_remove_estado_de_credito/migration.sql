/*
  Warnings:

  - You are about to drop the column `estadoDeCreditoId` on the `Creditos` table. All the data in the column will be lost.
  - You are about to drop the `EstadosDeCredito` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Creditos` DROP FOREIGN KEY `Creditos_estadoDeCreditoId_fkey`;

-- AlterTable
ALTER TABLE `Creditos` DROP COLUMN `estadoDeCreditoId`;

-- DropTable
DROP TABLE `EstadosDeCredito`;
