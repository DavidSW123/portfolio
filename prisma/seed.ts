import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import path from "path";
import bcrypt from "bcryptjs";

const dbPath = path.resolve(__dirname, "../dev.db");
const adapter = new PrismaLibSql({ url: `file:${dbPath}` });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  const adminHash = await bcrypt.hash("Admin123!", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@autoimport.pro" },
    update: {},
    create: {
      email: "admin@autoimport.pro",
      password: adminHash,
      name: "Administrador",
      role: "ADMIN",
    },
  });

  const providerHash = await bcrypt.hash("Provider123!", 12);
  await prisma.user.upsert({
    where: { email: "proveedor@autoimport.pro" },
    update: {},
    create: {
      email: "proveedor@autoimport.pro",
      password: providerHash,
      name: "Carlos García",
      role: "PROVIDER",
    },
  });

  const collabHash = await bcrypt.hash("Collab123!", 12);
  await prisma.user.upsert({
    where: { email: "colaborador@autoimport.pro" },
    update: {},
    create: {
      email: "colaborador@autoimport.pro",
      password: collabHash,
      name: "Ana Martínez",
      role: "COLLABORATOR",
    },
  });

  const clientHash = await bcrypt.hash("Client123!", 12);
  await prisma.user.upsert({
    where: { email: "cliente@autoimport.pro" },
    update: {},
    create: {
      email: "cliente@autoimport.pro",
      password: clientHash,
      name: "Pedro López",
      role: "CLIENT",
      client: {
        create: {
          phone: "+34 600 123 456",
          city: "Madrid",
          country: "España",
        },
      },
    },
  });

  const sampleCars = [
    { title: "BMW Serie 3 320d Sport 2022", brand: "BMW", model: "Serie 3 320d", year: 2022, mileage: 28000, color: "Negro", fuelType: "Diésel", transmission: "Automático", engine: "2.0 TDI 190cv", doors: 4, description: "Vehículo en perfecto estado. Pantalla táctil 10.25\", navegación, calefacción de asientos, sensores de aparcamiento.", basePrice: 32000 },
    { title: "Mercedes-Benz Clase C 220d AMG 2023", brand: "Mercedes-Benz", model: "Clase C 220d", year: 2023, mileage: 12000, color: "Blanco", fuelType: "Diésel", transmission: "Automático", engine: "2.0 CDI 200cv", doors: 4, description: "Prácticamente nuevo. AMG Line. Sistema MBUX, cámara 360°, cargador inalámbrico.", basePrice: 45000 },
    { title: "Tesla Model 3 Performance 2023", brand: "Tesla", model: "Model 3 Performance", year: 2023, mileage: 8000, color: "Rojo", fuelType: "Eléctrico", transmission: "Automático", engine: "Dual Motor AWD", doors: 4, description: "Tracción integral, 0-100 en 3.3s. Autonomía 547km. Piloto automático.", basePrice: 52000 },
    { title: "Porsche Macan S 2021", brand: "Porsche", model: "Macan S", year: 2021, mileage: 35000, color: "Gris", fuelType: "Gasolina", transmission: "Automático", engine: "2.9 V6 380cv", doors: 5, description: "SUV deportivo. Sport Chrono, Bose, techo panorámico, llantas 20\".", basePrice: 58000 },
    { title: "Audi A6 45 TFSI quattro 2022", brand: "Audi", model: "A6 45 TFSI", year: 2022, mileage: 22000, color: "Azul", fuelType: "Gasolina", transmission: "Automático", engine: "2.0 TFSI 245cv", doors: 4, description: "Berlina ejecutiva quattro. Virtual Cockpit Plus, Matrix LED, Bang & Olufsen.", basePrice: 42000 },
  ];

  for (const carData of sampleCars) {
    const slugId = `seed-${carData.brand.toLowerCase().replace(/[^a-z]/g, "")}-${carData.year}`;
    const finalPrice = Math.round(carData.basePrice * 1.3 * 100) / 100;
    await prisma.car.upsert({
      where: { id: slugId },
      update: {},
      create: {
        id: slugId,
        ...carData,
        markup: 30,
        finalPrice,
        status: "PUBLISHED",
        source: "ADMIN",
        isPublished: true,
        submittedById: admin.id,
        approvedById: admin.id,
        approvedAt: new Date(),
      },
    });
  }

  console.log("✅ Seed completado!");
  console.log("\nCuentas de prueba:");
  console.log("  Admin:        admin@autoimport.pro        / Admin123!");
  console.log("  Proveedor:    proveedor@autoimport.pro    / Provider123!");
  console.log("  Colaborador:  colaborador@autoimport.pro  / Collab123!");
  console.log("  Cliente:      cliente@autoimport.pro      / Client123!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
