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
    `ciudadId` INTEGER NULL,
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
    `titulo` VARCHAR(191) NOT NULL,
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
    `activa` BOOLEAN NOT NULL DEFAULT true,
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
    `cruzamientos` VARCHAR(191) NULL,
    `clienteId` VARCHAR(191) NULL,
    `coloniaId` VARCHAR(191) NOT NULL,
    `creadoPor` VARCHAR(191) NOT NULL,
    `fechaCreacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoPor` VARCHAR(191) NOT NULL DEFAULT 'ADMIN',
    `fechaActualizacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

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
    `cajaId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Cajas` (
    `id` VARCHAR(191) NOT NULL,
    `saldoInicial` DECIMAL(15, 2) NOT NULL,
    `fechaApertura` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `saldoFinal` DECIMAL(15, 2) NULL,
    `fechaCierre` DATETIME(3) NULL,
    `observaciones` VARCHAR(191) NULL,
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
    `tipoDePago` ENUM('REGULAR', 'MORA', 'ABONO', 'LIQUIDACION') NOT NULL,
    `fechaDePago` DATETIME(3) NOT NULL,
    `observaciones` VARCHAR(191) NULL,
    `creadoPor` VARCHAR(191) NOT NULL,
    `fechaCreacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoPor` VARCHAR(191) NOT NULL DEFAULT 'ADMIN',
    `fechaActualizacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `clienteId` VARCHAR(191) NOT NULL,
    `creditoId` VARCHAR(191) NULL,
    `cobradorId` VARCHAR(191) NOT NULL,
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
    `telefono2` VARCHAR(191) NULL,
    `multiplos` DECIMAL(15, 2) NOT NULL DEFAULT 1000.00,
    `porcentajeDePagos` DECIMAL(15, 2) NOT NULL DEFAULT 100.00,
    `porcentajeDeMora` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    `montoMinimo` DECIMAL(15, 2) NOT NULL,
    `montoMaximo` DECIMAL(15, 2) NOT NULL,
    `numeroCreditosCrecer` INTEGER NOT NULL DEFAULT 1,
    `activo` BOOLEAN NOT NULL DEFAULT true,
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
CREATE TABLE `Parentescos` (
    `id` VARCHAR(191) NOT NULL,
    `descripcion` VARCHAR(191) NOT NULL,
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
    `parentescoId` VARCHAR(191) NOT NULL,
    `otro` VARCHAR(191) NOT NULL,
    `ocupacion` VARCHAR(191) NOT NULL,
    `creadoPor` VARCHAR(191) NOT NULL,
    `fechaCreacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoPor` VARCHAR(191) NOT NULL DEFAULT 'ADMIN',
    `fechaActualizacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Productos` (
    `id` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `descripcion` VARCHAR(191) NOT NULL,
    `montoMinimo` DECIMAL(15, 2) NOT NULL,
    `montoMaximo` DECIMAL(15, 2) NOT NULL,
    `interes` DECIMAL(15, 2) NOT NULL,
    `interesMoratorio` DECIMAL(15, 2) NOT NULL,
    `tipoPenalizacion` ENUM('MONTO', 'PORCENTAJE') NOT NULL DEFAULT 'PORCENTAJE',
    `penalizacion` DECIMAL(15, 2) NOT NULL DEFAULT 0,
    `comision` DECIMAL(15, 2) NOT NULL DEFAULT 0,
    `cargos` DECIMAL(15, 2) NOT NULL DEFAULT 0,
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `numeroDePagos` INTEGER NOT NULL,
    `frecuencia` ENUM('DIARIO', 'SEMANAL', 'QUINCENAL', 'MENSUAL', 'BIMESTRAL', 'TRIMESTRAL', 'CUATRIMESTRAL', 'SEMESTRAL', 'ANUAL') NOT NULL,
    `creditosActivos` INTEGER NOT NULL DEFAULT 1,
    `creadoPor` VARCHAR(191) NOT NULL DEFAULT 'ADMIN',
    `fechaCreacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoPor` VARCHAR(191) NOT NULL DEFAULT 'ADMIN',
    `fechaActualizacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `diaSemana` INTEGER NULL,
    `diaMes` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Colocadores` (
    `id` VARCHAR(191) NOT NULL,
    `clienteId` VARCHAR(191) NULL,
    `usuarioId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Cobrador` (
    `id` VARCHAR(191) NOT NULL,
    `usuarioId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Creditos` (
    `id` VARCHAR(191) NOT NULL,
    `fechaDesembolso` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fechaInicio` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fechaFinal` DATETIME(3) NOT NULL,
    `fechaLiquidacion` DATETIME(3) NULL,
    `monto` DECIMAL(15, 2) NOT NULL,
    `cuota` DECIMAL(15, 2) NOT NULL,
    `cuotaCapital` DECIMAL(15, 2) NOT NULL,
    `cuotaInteres` DECIMAL(15, 2) NOT NULL,
    `cuotaMora` DECIMAL(15, 2) NOT NULL,
    `cuotaSeguro` DECIMAL(15, 2) NOT NULL,
    `observaciones` VARCHAR(191) NULL,
    `status` ENUM('ABIERTO', 'CERRADO', 'SUSPENDIDO', 'MORA') NOT NULL,
    `referidoPor` ENUM('COLOCADOR', 'CLIENTE') NOT NULL,
    `saldo` DECIMAL(65, 30) NULL,
    `creadoPor` VARCHAR(191) NOT NULL,
    `fechaCreacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoPor` VARCHAR(191) NOT NULL DEFAULT 'ADMIN',
    `fechaActualizacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `clienteId` VARCHAR(191) NOT NULL,
    `sucursalId` VARCHAR(191) NOT NULL,
    `productosId` VARCHAR(191) NOT NULL,
    `segurosId` VARCHAR(191) NOT NULL,
    `avalId` VARCHAR(191) NOT NULL,
    `modalidadDeSeguroId` VARCHAR(191) NOT NULL,
    `colocadorId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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

-- CreateTable
CREATE TABLE `Comisiones` (
    `id` VARCHAR(191) NOT NULL,
    `creadoPor` VARCHAR(191) NOT NULL,
    `fechaCreacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoPor` VARCHAR(191) NOT NULL DEFAULT 'ADMIN',
    `fechaActualizacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `usuarioId` VARCHAR(191) NOT NULL,
    `esquemaComisionId` VARCHAR(191) NOT NULL,
    `creditoId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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
ALTER TABLE `Pagos` ADD CONSTRAINT `Pagos_cobradorId_fkey` FOREIGN KEY (`cobradorId`) REFERENCES `Cobrador`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pagos` ADD CONSTRAINT `Pagos_sucursalId_fkey` FOREIGN KEY (`sucursalId`) REFERENCES `Sucursales`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

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
ALTER TABLE `Colocadores` ADD CONSTRAINT `Colocadores_clienteId_fkey` FOREIGN KEY (`clienteId`) REFERENCES `Clientes`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Colocadores` ADD CONSTRAINT `Colocadores_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuarios`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cobrador` ADD CONSTRAINT `Cobrador_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Creditos` ADD CONSTRAINT `Creditos_clienteId_fkey` FOREIGN KEY (`clienteId`) REFERENCES `Clientes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Creditos` ADD CONSTRAINT `Creditos_sucursalId_fkey` FOREIGN KEY (`sucursalId`) REFERENCES `Sucursales`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Creditos` ADD CONSTRAINT `Creditos_productosId_fkey` FOREIGN KEY (`productosId`) REFERENCES `Productos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Creditos` ADD CONSTRAINT `Creditos_segurosId_fkey` FOREIGN KEY (`segurosId`) REFERENCES `Seguros`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Creditos` ADD CONSTRAINT `Creditos_modalidadDeSeguroId_fkey` FOREIGN KEY (`modalidadDeSeguroId`) REFERENCES `ModalidadesDeSeguro`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Creditos` ADD CONSTRAINT `Creditos_avalId_fkey` FOREIGN KEY (`avalId`) REFERENCES `Avales`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Creditos` ADD CONSTRAINT `Creditos_colocadorId_fkey` FOREIGN KEY (`colocadorId`) REFERENCES `Colocadores`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comisiones` ADD CONSTRAINT `Comisiones_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comisiones` ADD CONSTRAINT `Comisiones_esquemaComisionId_fkey` FOREIGN KEY (`esquemaComisionId`) REFERENCES `EsquemasComision`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comisiones` ADD CONSTRAINT `Comisiones_creditoId_fkey` FOREIGN KEY (`creditoId`) REFERENCES `Creditos`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
