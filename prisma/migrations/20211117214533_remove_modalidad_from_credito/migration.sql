-- DropForeignKey
ALTER TABLE `Creditos` DROP FOREIGN KEY `Creditos_modalidadDeSeguroId_fkey`;

-- AlterTable
ALTER TABLE `Creditos` MODIFY `modalidadDeSeguroId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Creditos` ADD CONSTRAINT `Creditos_modalidadDeSeguroId_fkey` FOREIGN KEY (`modalidadDeSeguroId`) REFERENCES `ModalidadesDeSeguro`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
