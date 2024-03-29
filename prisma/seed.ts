import { PrismaClient } from '@prisma/client';

import {
  actividadesEconomicasCreate,
  usuarios,
  createCiudades,
  createColonias,
  createEstado,
  escolaridadesCreate,
  estadosCivilesCreate,
  generosCreate,
  modalidadesDeSeguro,
  parentescos,
  seguros,
  sucursales,
  tiposDeViviendaCreate,
  productos,
} from './seed-data';
import { createSucursal } from './sucursales';

/* eslint-disable prefer-arrow/prefer-arrow-functions */
const prisma = new PrismaClient();

async function main() {
  //Creates ADMIN user
  const admin = await prisma.usuario.createMany({
    data: usuarios,
  });

  if (admin) {
    console.log(`Usuarios creados conteo: ${admin.count}`);
    //Creates estado
    const estado = await prisma.estado.create({ data: createEstado });
    if (estado) {
      console.log(`Estado ${estado.descripcion} creado exitosamente.`);
      //Creates ciudades
      const ciudades = await prisma.ciudad.createMany({
        data: createCiudades(estado.id),
      });
      if (ciudades) {
        console.log(`Ciudades creadas exitosmente Conteo: ${ciudades.count}`);
        const colonias = await prisma.colonia.createMany({
          data: createColonias,
        });
        if (colonias) {
          console.log(`Colonias creadas exitosamente Conteo: ${colonias.count}`);
        }
      }
    }
    const segurosIns = await prisma.seguro.createMany({ data: seguros });
    if (segurosIns) {
      console.log(`Seguros creados exitosamente: ${segurosIns.count}`);
    }
    const modalidadesIns = await prisma.modalidadDeSeguro.createMany({
      data: modalidadesDeSeguro,
    });
    if (modalidadesIns) {
      console.log(`Modalidades de seguro creadas exitosamente: ${modalidadesIns.count}`);
    }
    const parentescosIns = await prisma.parentesco.createMany({
      data: parentescos,
    });
    if (parentescosIns) {
      console.log(`Parentescos creados exitosamente: ${parentescosIns.count}`);
    }
    const estadosCiviles = await prisma.estadoCivil.createMany({
      data: estadosCivilesCreate,
    });
    if (estadosCiviles) {
      console.log(`Estados Civiles creados exitosamente Conteo: ${estadosCiviles.count}`);
    }
    const generos = await prisma.genero.createMany({ data: generosCreate });
    if (generos) {
      console.log(`Generos creados exitosamente Conteo: ${generos.count}`);
    }
    const escolaridades = await prisma.escolaridad.createMany({
      data: escolaridadesCreate,
    });
    if (escolaridades) {
      console.log(`Escolaridades creadas exitosamente Conteo: ${escolaridades.count}`);
    }
    const tiposDeViviendas = await prisma.tipoDeVivienda.createMany({
      data: tiposDeViviendaCreate,
    });
    if (tiposDeViviendas) {
      console.log(`Tipos de viviendas creados exitosamente Conteo: ${tiposDeViviendas.count}`);
    }
    const actividadesEconomicas = await prisma.actividadEconomica.createMany({
      data: actividadesEconomicasCreate,
    });
    if (actividadesEconomicas) {
      console.log(`Actividades económicas creadas exitosamente Conteo: ${actividadesEconomicas.count}`);
    }
    if (sucursales) {
      let sucursalesCreated: number = 0;
      for (const sucursal of sucursales) {
        const data = await createSucursal(sucursal);
        if (data) {
          const createdSucursal = await prisma.sucursal.create({ data });
          if (createdSucursal) {
            sucursalesCreated++;
          }
        }
      }
      if (sucursalesCreated === sucursales.length) {
        console.log(`Sucursales creadas exitosamente Conteo: ${sucursales.length}`);
      }
    }
    if (productos) {
      const productorCreate = await prisma.producto.createMany({
        data: productos,
      });
      if (productorCreate) {
        console.log(`Productos creados exitosamente Conteo: ${productorCreate.count}`);
      }
    }
  }
}

main()
  .catch(e => {
    console.error(`Error Inicializando la base de datos ${e}`);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
