-- CreateTable
CREATE TABLE `TiposDePago` (
    `id` VARCHAR(191) NOT NULL,
    `descripcion` VARCHAR(191) NOT NULL,
    `creadoPor` VARCHAR(191) NOT NULL DEFAULT 'ADMIN',
    `fechaCreacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoPor` VARCHAR(191) NOT NULL DEFAULT 'ADMIN',
    `fechaActualizacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TiposDeInteres` (
    `id` VARCHAR(191) NOT NULL,
    `descripcion` VARCHAR(191) NOT NULL,
    `valor` INTEGER NOT NULL,
    `creadoPor` VARCHAR(191) NOT NULL DEFAULT 'ADMIN',
    `fechaCreacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoPor` VARCHAR(191) NOT NULL DEFAULT 'ADMIN',
    `fechaActualizacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `productoId` VARCHAR(191),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PeriodosDePago` (
    `id` VARCHAR(191) NOT NULL,
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
    `id` VARCHAR(191) NOT NULL,
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
    `id` VARCHAR(191) NOT NULL,
    `descripcion` VARCHAR(191) NOT NULL,
    `tipo` TINYTEXT NOT NULL,
    `valor` DECIMAL(15, 2) NOT NULL,
    `creadoPor` VARCHAR(191) NOT NULL DEFAULT 'ADMIN',
    `fechaCreacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoPor` VARCHAR(191) NOT NULL DEFAULT 'ADMIN',
    `fechaActualizacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `productoId` VARCHAR(191),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ActividadesEconomicas` (
    `id` VARCHAR(191) NOT NULL,
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
    `id` VARCHAR(191) NOT NULL,
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
CREATE TABLE `Colonias` (
    `id` VARCHAR(191) NOT NULL,
    `descripcion` VARCHAR(191) NOT NULL,
    `codigoPostal` VARCHAR(191) NOT NULL,
    `ciudadId` INTEGER,
    `creadoPor` VARCHAR(191) NOT NULL DEFAULT 'ADMIN',
    `fechaCreacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoPor` VARCHAR(191) NOT NULL DEFAULT 'ADMIN',
    `fechaActualizacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TiposDeVivienda` (
    `id` VARCHAR(191) NOT NULL,
    `descripcion` VARCHAR(191) NOT NULL,
    `creadoPor` VARCHAR(191) NOT NULL DEFAULT 'ADMIN',
    `fechaCreacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoPor` VARCHAR(191) NOT NULL DEFAULT 'ADMIN',
    `fechaActualizacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Escolaridades` (
    `id` VARCHAR(191) NOT NULL,
    `descripcion` VARCHAR(191) NOT NULL,
    `creadoPor` VARCHAR(191) NOT NULL DEFAULT 'ADMIN',
    `fechaCreacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoPor` VARCHAR(191) NOT NULL DEFAULT 'ADMIN',
    `fechaActualizacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Generos` (
    `id` VARCHAR(191) NOT NULL,
    `descripcion` VARCHAR(191) NOT NULL,
    `creadoPor` VARCHAR(191) NOT NULL DEFAULT 'ADMIN',
    `fechaCreacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoPor` VARCHAR(191) NOT NULL DEFAULT 'ADMIN',
    `fechaActualizacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Parentescos` (
    `id` VARCHAR(191) NOT NULL,
    `descripcion` VARCHAR(191) NOT NULL,
    `creadoPor` VARCHAR(191) NOT NULL DEFAULT 'ADMIN',
    `fechaCreacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoPor` VARCHAR(191) NOT NULL DEFAULT 'ADMIN',
    `fechaActualizacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Ocupaciones` (
    `id` VARCHAR(191) NOT NULL,
    `descripcion` VARCHAR(191) NOT NULL,
    `creadoPor` VARCHAR(191) NOT NULL DEFAULT 'ADMIN',
    `fechaCreacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoPor` VARCHAR(191) NOT NULL DEFAULT 'ADMIN',
    `fechaActualizacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EstadosDeCredito` (
    `id` VARCHAR(191) NOT NULL,
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
    `id` VARCHAR(191) NOT NULL,
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
    `id` VARCHAR(191) NOT NULL,
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
    `id` VARCHAR(191) NOT NULL,
    `descripcion` VARCHAR(191) NOT NULL,
    `creadoPor` VARCHAR(191) NOT NULL DEFAULT 'ADMIN',
    `fechaCreacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoPor` VARCHAR(191) NOT NULL DEFAULT 'ADMIN',
    `fechaActualizacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Usuarios` (
    `id` VARCHAR(191) NOT NULL,
    `nombreUsuario` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `apellido` VARCHAR(191) NOT NULL,
    `role` ENUM('USUARIO', 'ADMIN', 'DIRECTOR', 'CAJERO', 'MANAGER', 'SECRETARIO', 'COLOCADOR', 'COBRADOR', 'ALL') NOT NULL DEFAULT 'USUARIO',
    `creadoPor` VARCHAR(191) NOT NULL DEFAULT 'ADMIN',
    `fechaCreacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoPor` VARCHAR(191) NOT NULL DEFAULT 'ADMIN',
    `fechaActualizacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Usuarios_nombreUsuario_key`(`nombreUsuario`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Sucursales` (
    `id` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `telefono` VARCHAR(191) NOT NULL,
    `creadoPor` VARCHAR(191) NOT NULL DEFAULT 'ADMIN',
    `fechaCreacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoPor` VARCHAR(191) NOT NULL DEFAULT 'ADMIN',
    `fechaActualizacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `direccionId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Sucursales_nombre_key`(`nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Direcciones` (
    `id` VARCHAR(191) NOT NULL,
    `tipo` ENUM('SUCURSAL', 'CLIENTE', 'AVAL', 'NEGOCIO', 'TRABAJO', 'OTRO') NOT NULL,
    `calle` VARCHAR(191) NOT NULL,
    `numero` VARCHAR(191) NOT NULL,
    `cruzamientos` VARCHAR(191),
    `creadoPor` VARCHAR(191) NOT NULL,
    `fechaCreacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoPor` VARCHAR(191) NOT NULL DEFAULT 'ADMIN',
    `fechaActualizacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `clienteId` VARCHAR(191),
    `coloniaId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MovimientosDeCaja` (
    `id` VARCHAR(191) NOT NULL,
    `monto` DECIMAL(15, 2) NOT NULL,
    `tipo` ENUM('DEPOSITO', 'RETIRO') NOT NULL,
    `observaciones` VARCHAR(191) NOT NULL,
    `creadoPor` VARCHAR(191) NOT NULL,
    `fechaCreacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoPor` VARCHAR(191) NOT NULL DEFAULT 'ADMIN',
    `fechaActualizacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `cajaId` VARCHAR(191),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Cajas` (
    `id` VARCHAR(191) NOT NULL,
    `saldoInicial` DECIMAL(15, 2) NOT NULL,
    `observaciones` VARCHAR(191),
    `creadoPor` VARCHAR(191) NOT NULL,
    `fechaCreacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoPor` VARCHAR(191) NOT NULL DEFAULT 'ADMIN',
    `fechaActualizacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `sucursalId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pagos` (
    `id` VARCHAR(191) NOT NULL,
    `monto` DECIMAL(15, 2) NOT NULL,
    `fechaDePago` DATETIME(3) NOT NULL,
    `observaciones` VARCHAR(191),
    `creditoId` VARCHAR(191),
    `creadoPor` VARCHAR(191) NOT NULL,
    `fechaCreacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoPor` VARCHAR(191) NOT NULL DEFAULT 'ADMIN',
    `fechaActualizacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `clienteId` VARCHAR(191) NOT NULL,
    `sucursalId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Clientes` (
    `id` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `apellidoPaterno` VARCHAR(191) NOT NULL,
    `apellidoMaterno` VARCHAR(191) NOT NULL,
    `fechaDeNacimiento` DATETIME(3) NOT NULL,
    `rfc` VARCHAR(191) NOT NULL,
    `curp` VARCHAR(191) NOT NULL,
    `telefono1` VARCHAR(191) NOT NULL,
    `telefono2` VARCHAR(191),
    `montoMinimo` DECIMAL(15, 2) NOT NULL,
    `montoMaximo` DECIMAL(15, 2) NOT NULL,
    `numeroCreditosCrecer` INTEGER NOT NULL DEFAULT 3,
    `estadoCivilId` VARCHAR(191) NOT NULL,
    `tipoDeViviendaId` VARCHAR(191) NOT NULL,
    `escolaridadId` VARCHAR(191) NOT NULL,
    `generoId` VARCHAR(191) NOT NULL,
    `trabajoId` VARCHAR(191) NOT NULL,
    `creadoPor` VARCHAR(191) NOT NULL,
    `fechaCreacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoPor` VARCHAR(191) NOT NULL DEFAULT 'ADMIN',
    `fechaActualizacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Clientes_rfc_key`(`rfc`),
    UNIQUE INDEX `Clientes_curp_key`(`curp`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Trabajos` (
    `id` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `telefono` VARCHAR(191) NOT NULL,
    `antiguedad` INTEGER NOT NULL,
    `direccionId` VARCHAR(191) NOT NULL,
    `actividadEconomicaId` VARCHAR(191) NOT NULL,
    `creadoPor` VARCHAR(191) NOT NULL,
    `fechaCreacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoPor` VARCHAR(191) NOT NULL DEFAULT 'ADMIN',
    `fechaActualizacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Avales` (
    `id` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `apellidoPaterno` VARCHAR(191) NOT NULL,
    `apellidoMaterno` VARCHAR(191) NOT NULL,
    `telefono` VARCHAR(191) NOT NULL,
    `fechaDeNacimiento` DATETIME(3) NOT NULL,
    `creadoPor` VARCHAR(191) NOT NULL,
    `fechaCreacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoPor` VARCHAR(191) NOT NULL DEFAULT 'ADMIN',
    `fechaActualizacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `parentescoId` VARCHAR(191) NOT NULL,
    `ocupacionId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Productos` (
    `id` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `descripcion` VARCHAR(191) NOT NULL,
    `montoMinimo` DECIMAL(15, 2) NOT NULL,
    `montoMaximo` DECIMAL(15, 2) NOT NULL,
    `multiplos` DECIMAL(15, 2) NOT NULL,
    `duracion` INTEGER NOT NULL,
    `numeroDePagos` INTEGER NOT NULL,
    `frecuenciaDePagoId` VARCHAR(191) NOT NULL,
    `creadoPor` VARCHAR(191) NOT NULL DEFAULT 'ADMIN',
    `fechaCreacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoPor` VARCHAR(191) NOT NULL DEFAULT 'ADMIN',
    `fechaActualizacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Creditos` (
    `id` VARCHAR(191) NOT NULL,
    `fechaInicio` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fechaFinal` DATETIME(3) NOT NULL,
    `fechaLiquidacion` DATETIME(3) NOT NULL,
    `monto` DECIMAL(15, 2) NOT NULL,
    `creadoPor` VARCHAR(191) NOT NULL,
    `fechaCreacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoPor` VARCHAR(191) NOT NULL DEFAULT 'ADMIN',
    `fechaActualizacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `clienteId` VARCHAR(191) NOT NULL,
    `sucursalId` VARCHAR(191) NOT NULL,
    `estadoDeCreditoId` VARCHAR(191) NOT NULL,
    `productosId` VARCHAR(191) NOT NULL,
    `segurosId` VARCHAR(191) NOT NULL,
    `modalidadDeSeguroId` VARCHAR(191) NOT NULL,
    `avalId` VARCHAR(191) NOT NULL,
    `trabajoId` VARCHAR(191),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Comisiones` (
    `id` VARCHAR(191) NOT NULL,
    `creadoPor` VARCHAR(191) NOT NULL,
    `fechaCreacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoPor` VARCHAR(191) NOT NULL DEFAULT 'ADMIN',
    `fechaActualizacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `creditoId` VARCHAR(191) NOT NULL,
    `sucursalId` VARCHAR(191) NOT NULL,
    `usuarioId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `TiposDeInteres` ADD CONSTRAINT `TiposDeInteres_productoId_fkey` FOREIGN KEY (`productoId`) REFERENCES `Productos`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tarifas` ADD CONSTRAINT `Tarifas_productoId_fkey` FOREIGN KEY (`productoId`) REFERENCES `Productos`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ciudades` ADD CONSTRAINT `Ciudades_estadoId_fkey` FOREIGN KEY (`estadoId`) REFERENCES `Estados`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Colonias` ADD CONSTRAINT `Colonias_ciudadId_fkey` FOREIGN KEY (`ciudadId`) REFERENCES `Ciudades`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Sucursales` ADD CONSTRAINT `Sucursales_direccionId_fkey` FOREIGN KEY (`direccionId`) REFERENCES `Direcciones`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Direcciones` ADD CONSTRAINT `Direcciones_coloniaId_fkey` FOREIGN KEY (`coloniaId`) REFERENCES `Colonias`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Direcciones` ADD CONSTRAINT `Direcciones_clienteId_fkey` FOREIGN KEY (`clienteId`) REFERENCES `Clientes`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MovimientosDeCaja` ADD CONSTRAINT `MovimientosDeCaja_cajaId_fkey` FOREIGN KEY (`cajaId`) REFERENCES `Cajas`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cajas` ADD CONSTRAINT `Cajas_sucursalId_fkey` FOREIGN KEY (`sucursalId`) REFERENCES `Sucursales`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pagos` ADD CONSTRAINT `Pagos_creditoId_fkey` FOREIGN KEY (`creditoId`) REFERENCES `Creditos`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Clientes` ADD CONSTRAINT `Clientes_trabajoId_fkey` FOREIGN KEY (`trabajoId`) REFERENCES `Trabajos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Clientes` ADD CONSTRAINT `Clientes_estadoCivilId_fkey` FOREIGN KEY (`estadoCivilId`) REFERENCES `EstadosCiviles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Clientes` ADD CONSTRAINT `Clientes_tipoDeViviendaId_fkey` FOREIGN KEY (`tipoDeViviendaId`) REFERENCES `TiposDeVivienda`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Clientes` ADD CONSTRAINT `Clientes_escolaridadId_fkey` FOREIGN KEY (`escolaridadId`) REFERENCES `Escolaridades`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Clientes` ADD CONSTRAINT `Clientes_generoId_fkey` FOREIGN KEY (`generoId`) REFERENCES `Generos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Trabajos` ADD CONSTRAINT `Trabajos_direccionId_fkey` FOREIGN KEY (`direccionId`) REFERENCES `Direcciones`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Trabajos` ADD CONSTRAINT `Trabajos_actividadEconomicaId_fkey` FOREIGN KEY (`actividadEconomicaId`) REFERENCES `ActividadesEconomicas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Avales` ADD CONSTRAINT `Avales_parentescoId_fkey` FOREIGN KEY (`parentescoId`) REFERENCES `Parentescos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Avales` ADD CONSTRAINT `Avales_ocupacionId_fkey` FOREIGN KEY (`ocupacionId`) REFERENCES `Ocupaciones`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Productos` ADD CONSTRAINT `Productos_frecuenciaDePagoId_fkey` FOREIGN KEY (`frecuenciaDePagoId`) REFERENCES `FrecuenciasDePago`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Creditos` ADD CONSTRAINT `Creditos_clienteId_fkey` FOREIGN KEY (`clienteId`) REFERENCES `Clientes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Creditos` ADD CONSTRAINT `Creditos_sucursalId_fkey` FOREIGN KEY (`sucursalId`) REFERENCES `Sucursales`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Creditos` ADD CONSTRAINT `Creditos_estadoDeCreditoId_fkey` FOREIGN KEY (`estadoDeCreditoId`) REFERENCES `EstadosDeCredito`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Creditos` ADD CONSTRAINT `Creditos_productosId_fkey` FOREIGN KEY (`productosId`) REFERENCES `Productos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Creditos` ADD CONSTRAINT `Creditos_segurosId_fkey` FOREIGN KEY (`segurosId`) REFERENCES `Seguros`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Creditos` ADD CONSTRAINT `Creditos_modalidadDeSeguroId_fkey` FOREIGN KEY (`modalidadDeSeguroId`) REFERENCES `ModalidadesDeSeguro`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Creditos` ADD CONSTRAINT `Creditos_avalId_fkey` FOREIGN KEY (`avalId`) REFERENCES `Avales`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Creditos` ADD CONSTRAINT `Creditos_trabajoId_fkey` FOREIGN KEY (`trabajoId`) REFERENCES `Trabajos`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comisiones` ADD CONSTRAINT `Comisiones_creditoId_fkey` FOREIGN KEY (`creditoId`) REFERENCES `Creditos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comisiones` ADD CONSTRAINT `Comisiones_sucursalId_fkey` FOREIGN KEY (`sucursalId`) REFERENCES `Sucursales`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comisiones` ADD CONSTRAINT `Comisiones_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
