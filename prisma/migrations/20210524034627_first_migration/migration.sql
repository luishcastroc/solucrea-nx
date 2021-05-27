-- CreateTable
CREATE TABLE `TiposDePago` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `descripcion` VARCHAR(191) NOT NULL,
    `creadoPor` VARCHAR(191) NOT NULL DEFAULT 'ADMIN',
    `fechaCreacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoPor` VARCHAR(191) NOT NULL DEFAULT 'ADMIN',
    `fechaActualizacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TiposDeInteres` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `descripcion` VARCHAR(191) NOT NULL,
    `valor` INTEGER NOT NULL,
    `creadoPor` VARCHAR(191) NOT NULL DEFAULT 'ADMIN',
    `fechaCreacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoPor` VARCHAR(191) NOT NULL DEFAULT 'ADMIN',
    `fechaActualizacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `productoId` INTEGER,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PeriodosDePago` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `descripcion` VARCHAR(191) NOT NULL,
    `periodo` INTEGER NOT NULL,
    `vencimiento` INTEGER NOT NULL,
    `creadoPor` VARCHAR(191) NOT NULL DEFAULT 'ADMIN',
    `fechaCreacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoPor` VARCHAR(191) NOT NULL DEFAULT 'ADMIN',
    `fechaActualizacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FrecuenciasDePago` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `descripcion` VARCHAR(191) NOT NULL,
    `diaInicio` INTEGER NOT NULL,
    `diaFin` INTEGER NOT NULL,
    `diaDelMes` INTEGER NOT NULL,
    `semanaDelMes` INTEGER NOT NULL,
    `creadoPor` VARCHAR(191) NOT NULL DEFAULT 'ADMIN',
    `fechaCreacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoPor` VARCHAR(191) NOT NULL DEFAULT 'ADMIN',
    `fechaActualizacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tarifas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `descripcion` VARCHAR(191) NOT NULL,
    `tipo` TINYTEXT NOT NULL,
    `valor` DECIMAL(15, 2) NOT NULL,
    `creadoPor` VARCHAR(191) NOT NULL DEFAULT 'ADMIN',
    `fechaCreacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoPor` VARCHAR(191) NOT NULL DEFAULT 'ADMIN',
    `fechaActualizacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `productoId` INTEGER,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ActividadesEconomicas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `descripcion` VARCHAR(191) NOT NULL,
    `montoMin` DECIMAL(15, 2) NOT NULL,
    `montoMax` DECIMAL(15, 2) NOT NULL,
    `cicloEscalonado` INTEGER NOT NULL,
    `creadoPor` VARCHAR(191) NOT NULL DEFAULT 'ADMIN',
    `fechaCreacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoPor` VARCHAR(191) NOT NULL DEFAULT 'ADMIN',
    `fechaActualizacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EstadosCiviles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `descripcion` VARCHAR(191) NOT NULL,
    `creadoPor` VARCHAR(191) NOT NULL DEFAULT 'ADMIN',
    `fechaCreacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoPor` VARCHAR(191) NOT NULL DEFAULT 'ADMIN',
    `fechaActualizacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Estados` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `descripcion` VARCHAR(191) NOT NULL,
    `creadoPor` VARCHAR(191) NOT NULL DEFAULT 'ADMIN',
    `fechaCreacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoPor` VARCHAR(191) NOT NULL DEFAULT 'ADMIN',
    `fechaActualizacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Ciudades` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `descripcion` VARCHAR(191) NOT NULL,
    `creadoPor` VARCHAR(191) NOT NULL DEFAULT 'ADMIN',
    `fechaCreacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoPor` VARCHAR(191) NOT NULL DEFAULT 'ADMIN',
    `fechaActualizacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `estadoId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Fraccionamientos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `descripcion` VARCHAR(191) NOT NULL,
    `creadoPor` VARCHAR(191) NOT NULL DEFAULT 'ADMIN',
    `fechaCreacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoPor` VARCHAR(191) NOT NULL DEFAULT 'ADMIN',
    `fechaActualizacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `codigoPostalId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CodigosPostales` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `codigoPostal` INTEGER NOT NULL,
    `creadoPor` VARCHAR(191) NOT NULL DEFAULT 'ADMIN',
    `fechaCreacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoPor` VARCHAR(191) NOT NULL DEFAULT 'ADMIN',
    `fechaActualizacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `estadoId` INTEGER NOT NULL,

    UNIQUE INDEX `CodigosPostales.codigoPostal_unique`(`codigoPostal`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TiposDeVivienda` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `descripcion` VARCHAR(191) NOT NULL,
    `creadoPor` VARCHAR(191) NOT NULL DEFAULT 'ADMIN',
    `fechaCreacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoPor` VARCHAR(191) NOT NULL DEFAULT 'ADMIN',
    `fechaActualizacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Escolaridades` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `descripcion` VARCHAR(191) NOT NULL,
    `creadoPor` VARCHAR(191) NOT NULL DEFAULT 'ADMIN',
    `fechaCreacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoPor` VARCHAR(191) NOT NULL DEFAULT 'ADMIN',
    `fechaActualizacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Generos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `descripcion` VARCHAR(191) NOT NULL,
    `creadoPor` VARCHAR(191) NOT NULL DEFAULT 'ADMIN',
    `fechaCreacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoPor` VARCHAR(191) NOT NULL DEFAULT 'ADMIN',
    `fechaActualizacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Parentescos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `descripcion` VARCHAR(191) NOT NULL,
    `creadoPor` VARCHAR(191) NOT NULL DEFAULT 'ADMIN',
    `fechaCreacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoPor` VARCHAR(191) NOT NULL DEFAULT 'ADMIN',
    `fechaActualizacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Ocupaciones` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `descripcion` VARCHAR(191) NOT NULL,
    `creadoPor` VARCHAR(191) NOT NULL DEFAULT 'ADMIN',
    `fechaCreacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoPor` VARCHAR(191) NOT NULL DEFAULT 'ADMIN',
    `fechaActualizacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EstadosDeCredito` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `descripcion` VARCHAR(191) NOT NULL,
    `creadoPor` VARCHAR(191) NOT NULL DEFAULT 'ADMIN',
    `fechaCreacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoPor` VARCHAR(191) NOT NULL DEFAULT 'ADMIN',
    `fechaActualizacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Seguros` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `monto` DECIMAL(15, 2) NOT NULL,
    `creadoPor` VARCHAR(191) NOT NULL DEFAULT 'ADMIN',
    `fechaCreacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoPor` VARCHAR(191) NOT NULL DEFAULT 'ADMIN',
    `fechaActualizacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ModalidadesDeSeguro` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `descripcion` VARCHAR(191) NOT NULL,
    `creadoPor` VARCHAR(191) NOT NULL DEFAULT 'ADMIN',
    `fechaCreacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoPor` VARCHAR(191) NOT NULL DEFAULT 'ADMIN',
    `fechaActualizacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Conceptos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `descripcion` VARCHAR(191) NOT NULL,
    `creadoPor` VARCHAR(191) NOT NULL DEFAULT 'ADMIN',
    `fechaCreacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoPor` VARCHAR(191) NOT NULL DEFAULT 'ADMIN',
    `fechaActualizacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Usuarios` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombreUsuario` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `apellido` VARCHAR(191) NOT NULL,
    `role` ENUM('USUARIO', 'ADMIN', 'DIRECTOR', 'CAJERO', 'MANAGER', 'SECRE') NOT NULL DEFAULT 'USUARIO',
    `creadoPor` VARCHAR(191) NOT NULL DEFAULT 'ADMIN',
    `fechaCreacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoPor` VARCHAR(191) NOT NULL DEFAULT 'ADMIN',
    `fechaActualizacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `sucursalId` INTEGER,

    UNIQUE INDEX `Usuarios.nombreUsuario_unique`(`nombreUsuario`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Sucursales` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `telefono` VARCHAR(191) NOT NULL,
    `creadoPor` VARCHAR(191) NOT NULL DEFAULT 'ADMIN',
    `fechaCreacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoPor` VARCHAR(191) NOT NULL DEFAULT 'ADMIN',
    `fechaActualizacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `direccionId` INTEGER NOT NULL,

    UNIQUE INDEX `Sucursales.nombre_unique`(`nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Direccion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tipo` ENUM('SUCURSAL', 'CLIENTE', 'AVAL', 'NEGOCIO', 'OTRO') NOT NULL,
    `calle` VARCHAR(191) NOT NULL,
    `numero` VARCHAR(191) NOT NULL,
    `cruzamientos` VARCHAR(191),
    `colonia` VARCHAR(191) NOT NULL,
    `codigoPostal` INTEGER NOT NULL,
    `creadoPor` VARCHAR(191) NOT NULL DEFAULT 'ADMIN',
    `fechaCreacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoPor` VARCHAR(191) NOT NULL DEFAULT 'ADMIN',
    `fechaActualizacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `ciudadId` INTEGER NOT NULL,
    `estadoId` INTEGER NOT NULL,
    `clienteId` INTEGER,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MovimientosDeCaja` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `monto` DECIMAL(15, 2) NOT NULL,
    `tipo` ENUM('DEPOSITO', 'RETIRO') NOT NULL,
    `observaciones` VARCHAR(191) NOT NULL,
    `creadoPor` VARCHAR(191) NOT NULL,
    `fechaCreacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `cajaId` INTEGER,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Cajas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `saldoInicial` DECIMAL(15, 2) NOT NULL,
    `observaciones` VARCHAR(191) NOT NULL,
    `creadoPor` VARCHAR(191) NOT NULL DEFAULT 'ADMIN',
    `fechaCreacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoPor` VARCHAR(191) NOT NULL DEFAULT 'ADMIN',
    `fechaActualizacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `sucursalId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Clientes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `apellidos` VARCHAR(191) NOT NULL,
    `fechaDeNacimiento` DATETIME(3) NOT NULL,
    `rfc` VARCHAR(191) NOT NULL,
    `curp` VARCHAR(191) NOT NULL,
    `telefono1` VARCHAR(191) NOT NULL,
    `telefono2` VARCHAR(191),
    `montoMinimo` DECIMAL(15, 2) NOT NULL,
    `montoMaximo` DECIMAL(15, 2) NOT NULL,
    `numeroCreditosCrecer` INTEGER NOT NULL DEFAULT 3,
    `estadoCivilId` INTEGER NOT NULL,
    `tipoDeViviedaId` INTEGER NOT NULL,
    `escolaridadId` INTEGER NOT NULL,
    `generoId` INTEGER NOT NULL,
    `creadoPor` VARCHAR(191) NOT NULL,
    `fechaCreacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoPor` VARCHAR(191) NOT NULL DEFAULT 'ADMIN',
    `fechaActualizacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Clientes.rfc_unique`(`rfc`),
    UNIQUE INDEX `Clientes.curp_unique`(`curp`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Avales` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `apellidos` VARCHAR(191) NOT NULL,
    `telefono` VARCHAR(191) NOT NULL,
    `fechaDeNacimiento` DATETIME(3) NOT NULL,
    `creadoPor` VARCHAR(191) NOT NULL DEFAULT 'ADMIN',
    `fechaCreacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoPor` VARCHAR(191) NOT NULL DEFAULT 'ADMIN',
    `fechaActualizacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `parentescoId` INTEGER NOT NULL,
    `ocupacionId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Comisionistas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `apellidoPaterno` VARCHAR(191) NOT NULL,
    `apellidoMaterno` VARCHAR(191) NOT NULL,
    `descripcion` VARCHAR(191) NOT NULL,
    `posicion` ENUM('COLOCADOR', 'COBRADOR') NOT NULL,
    `creadoPor` VARCHAR(191) NOT NULL DEFAULT 'ADMIN',
    `fechaCreacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoPor` VARCHAR(191) NOT NULL DEFAULT 'ADMIN',
    `fechaActualizacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `creditoId` INTEGER,
    `sucursalId` INTEGER,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Productos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `descripcion` VARCHAR(191) NOT NULL,
    `montoMinimo` DECIMAL(15, 2) NOT NULL,
    `montoMaximo` DECIMAL(15, 2) NOT NULL,
    `multiplos` DECIMAL(15, 2) NOT NULL,
    `duracion` INTEGER NOT NULL,
    `pagos` INTEGER NOT NULL,
    `frecuenciaDePagoId` INTEGER NOT NULL,
    `creadoPor` VARCHAR(191) NOT NULL,
    `fechaCreacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoPor` VARCHAR(191) NOT NULL,
    `fechaActualizacion` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Creditos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fechaInicio` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fechaFinal` DATETIME(3) NOT NULL,
    `fechaLiquidacion` DATETIME(3) NOT NULL,
    `monto` DECIMAL(15, 2) NOT NULL,
    `creadoPor` VARCHAR(191) NOT NULL,
    `fechaCreacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoPor` VARCHAR(191) NOT NULL,
    `fechaActualizacion` DATETIME(3) NOT NULL,
    `clienteId` INTEGER NOT NULL,
    `sucursalId` INTEGER NOT NULL,
    `estadoDeCreditoId` INTEGER NOT NULL,
    `productosId` INTEGER NOT NULL,
    `segurosId` INTEGER NOT NULL,
    `modalidadDeSeguroId` INTEGER NOT NULL,
    `avalId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Comisiones` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `creditoId` INTEGER NOT NULL,
    `sucursalId` INTEGER NOT NULL,
    `comisionistaId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_CiudadToCodigoPostal` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_CiudadToCodigoPostal_AB_unique`(`A`, `B`),
    INDEX `_CiudadToCodigoPostal_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Avales` ADD FOREIGN KEY (`parentescoId`) REFERENCES `Parentescos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Avales` ADD FOREIGN KEY (`ocupacionId`) REFERENCES `Ocupaciones`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ciudades` ADD FOREIGN KEY (`estadoId`) REFERENCES `Estados`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Productos` ADD FOREIGN KEY (`frecuenciaDePagoId`) REFERENCES `FrecuenciasDePago`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cajas` ADD FOREIGN KEY (`sucursalId`) REFERENCES `Sucursales`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Clientes` ADD FOREIGN KEY (`estadoCivilId`) REFERENCES `EstadosCiviles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Clientes` ADD FOREIGN KEY (`tipoDeViviedaId`) REFERENCES `TiposDeVivienda`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Clientes` ADD FOREIGN KEY (`escolaridadId`) REFERENCES `Escolaridades`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Clientes` ADD FOREIGN KEY (`generoId`) REFERENCES `Generos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comisiones` ADD FOREIGN KEY (`creditoId`) REFERENCES `Creditos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comisiones` ADD FOREIGN KEY (`sucursalId`) REFERENCES `Sucursales`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comisiones` ADD FOREIGN KEY (`comisionistaId`) REFERENCES `Comisionistas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Fraccionamientos` ADD FOREIGN KEY (`codigoPostalId`) REFERENCES `CodigosPostales`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Direccion` ADD FOREIGN KEY (`ciudadId`) REFERENCES `Ciudades`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Direccion` ADD FOREIGN KEY (`estadoId`) REFERENCES `Estados`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Direccion` ADD FOREIGN KEY (`clienteId`) REFERENCES `Clientes`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TiposDeInteres` ADD FOREIGN KEY (`productoId`) REFERENCES `Productos`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CodigosPostales` ADD FOREIGN KEY (`estadoId`) REFERENCES `Estados`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Creditos` ADD FOREIGN KEY (`clienteId`) REFERENCES `Clientes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Creditos` ADD FOREIGN KEY (`sucursalId`) REFERENCES `Sucursales`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Creditos` ADD FOREIGN KEY (`estadoDeCreditoId`) REFERENCES `EstadosDeCredito`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Creditos` ADD FOREIGN KEY (`productosId`) REFERENCES `Productos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Creditos` ADD FOREIGN KEY (`segurosId`) REFERENCES `Seguros`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Creditos` ADD FOREIGN KEY (`modalidadDeSeguroId`) REFERENCES `ModalidadesDeSeguro`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Creditos` ADD FOREIGN KEY (`avalId`) REFERENCES `Avales`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CiudadToCodigoPostal` ADD FOREIGN KEY (`A`) REFERENCES `Ciudades`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CiudadToCodigoPostal` ADD FOREIGN KEY (`B`) REFERENCES `CodigosPostales`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tarifas` ADD FOREIGN KEY (`productoId`) REFERENCES `Productos`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Usuarios` ADD FOREIGN KEY (`sucursalId`) REFERENCES `Sucursales`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Sucursales` ADD FOREIGN KEY (`direccionId`) REFERENCES `Direccion`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comisionistas` ADD FOREIGN KEY (`sucursalId`) REFERENCES `Sucursales`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comisionistas` ADD FOREIGN KEY (`creditoId`) REFERENCES `Creditos`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MovimientosDeCaja` ADD FOREIGN KEY (`cajaId`) REFERENCES `Cajas`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- Insert User
INSERT INTO `solucrea-db`.Usuarios
(id, nombreUsuario, password, nombre, apellido, `role`)
VALUES(1, 'admin', '$2b$10$PcFzBj9LN22dXBMnIfYOneRpgBuS1fZ7CcRVDuD.4p/eqaQkl08T2', 'Admin', 'Admin', 'ADMIN');
