/*
  Warnings:

  - You are about to drop the column `trabajoId` on the `Creditos` table. All the data in the column will be lost.
  - You are about to drop the column `nombre` on the `ModalidadesDeSeguro` table. All the data in the column will be lost.
  - You are about to drop the `Tarifas` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TiposDeInteres` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `interes` to the `Productos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `interesMoratorio` to the `Productos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `modalidadDeSeguroId` to the `Seguros` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Creditos` DROP FOREIGN KEY `Creditos_trabajoId_fkey`;

-- DropForeignKey
ALTER TABLE `Tarifas` DROP FOREIGN KEY `Tarifas_productoId_fkey`;

-- DropForeignKey
ALTER TABLE `TiposDeInteres` DROP FOREIGN KEY `TiposDeInteres_productoId_fkey`;

-- AlterTable
ALTER TABLE `Creditos` DROP COLUMN `trabajoId`;

-- AlterTable
ALTER TABLE `ModalidadesDeSeguro` DROP COLUMN `nombre`;

-- AlterTable
ALTER TABLE `Productos` ADD COLUMN `cargos` DECIMAL(15, 2) NOT NULL DEFAULT 0,
    ADD COLUMN `comision` DECIMAL(15, 2) NOT NULL DEFAULT 0,
    ADD COLUMN `interes` DECIMAL(15, 2) NOT NULL,
    ADD COLUMN `interesMoratorio` DECIMAL(15, 2) NOT NULL,
    ADD COLUMN `penalizacion` DECIMAL(15, 2) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `Seguros` ADD COLUMN `modalidadDeSeguroId` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `Tarifas`;

-- DropTable
DROP TABLE `TiposDeInteres`;

-- AddForeignKey
ALTER TABLE `Seguros` ADD CONSTRAINT `Seguros_modalidadDeSeguroId_fkey` FOREIGN KEY (`modalidadDeSeguroId`) REFERENCES `ModalidadesDeSeguro`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
