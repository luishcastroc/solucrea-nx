/*
  Warnings:

  - Added the required column `esquemaComisionId` to the `Comisiones` table without a default value. This is not possible if the table is not empty.
  - Added the required column `monto` to the `Comisiones` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Comisiones` ADD COLUMN `esquemaComisionId` VARCHAR(191) NOT NULL,
    ADD COLUMN `monto` DECIMAL(15, 2) NOT NULL;

-- CreateTable
CREATE TABLE `EsquemasComision` (
    `id` VARCHAR(191) NOT NULL,
    `tipo` ENUM('PORCENTAJE', 'MONTO') NOT NULL,
    `descripcion` VARCHAR(191) NOT NULL,
    `monto` VARCHAR(191) NOT NULL,
    `creadoPor` VARCHAR(191) NOT NULL,
    `fechaCreacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoPor` VARCHAR(191) NOT NULL DEFAULT 'ADMIN',
    `fechaActualizacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Comisiones` ADD CONSTRAINT `Comisiones_esquemaComisionId_fkey` FOREIGN KEY (`esquemaComisionId`) REFERENCES `EsquemasComision`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
