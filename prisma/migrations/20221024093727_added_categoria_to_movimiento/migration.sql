/*
  Warnings:

  - You are about to drop the column `esquemaComisionId` on the `Comisiones` table. All the data in the column will be lost.
  - You are about to drop the column `usuarioId` on the `Comisiones` table. All the data in the column will be lost.
  - You are about to drop the `EsquemasComision` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `cobradorId` to the `Comisiones` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipoComisionId` to the `Comisiones` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Comisiones` DROP FOREIGN KEY `Comisiones_esquemaComisionId_fkey`;

-- DropForeignKey
ALTER TABLE `Comisiones` DROP FOREIGN KEY `Comisiones_usuarioId_fkey`;

-- AlterTable
ALTER TABLE `Comisiones` DROP COLUMN `esquemaComisionId`,
    DROP COLUMN `usuarioId`,
    ADD COLUMN `cobradorId` VARCHAR(191) NOT NULL,
    ADD COLUMN `tipoComisionId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `MovimientosDeCaja` ADD COLUMN `categoria` ENUM('PRESTAMO', 'COMISION', 'ADMINISTRATIVO', 'MISCELANEO') NULL;

-- DropTable
DROP TABLE `EsquemasComision`;

-- CreateTable
CREATE TABLE `TipossComision` (
    `id` VARCHAR(191) NOT NULL,
    `tipo` ENUM('PAGO', 'FINALIZACION') NOT NULL,
    `descripcion` VARCHAR(191) NOT NULL,
    `monto` VARCHAR(191) NOT NULL,
    `creadoPor` VARCHAR(191) NOT NULL,
    `fechaCreacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoPor` VARCHAR(191) NOT NULL DEFAULT 'ADMIN',
    `fechaActualizacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Comisiones` ADD CONSTRAINT `Comisiones_cobradorId_fkey` FOREIGN KEY (`cobradorId`) REFERENCES `Cobrador`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comisiones` ADD CONSTRAINT `Comisiones_tipoComisionId_fkey` FOREIGN KEY (`tipoComisionId`) REFERENCES `TipossComision`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
