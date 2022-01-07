/*
  Warnings:

  - Added the required column `usuarioId` to the `Creditos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Creditos` ADD COLUMN `usuarioId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Creditos` ADD CONSTRAINT `Creditos_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
