import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.SEED_SECRET) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
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

    const cars = [
      {
        id: "seed-bmw-m4-2023",
        title: "BMW M4 Competition 2023",
        brand: "BMW", model: "M4 Competition", year: 2023, mileage: 8500,
        color: "Blanco Alpino", fuelType: "Gasolina", transmission: "Automático",
        engine: "3.0 M TwinPower 510cv", doors: 2,
        description: "El BMW M4 Competition es la cúspide de la ingeniería deportiva alemana. Con 510cv, 0-100 en 3.9s y tracción trasera, ofrece una experiencia de conducción inigualable.",
        basePrice: 92000,
        photos: [
          "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80",
          "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80",
        ],
      },
      {
        id: "seed-porsche-911-2022",
        title: "Porsche 911 Carrera S 2022",
        brand: "Porsche", model: "911 Carrera S", year: 2022, mileage: 14200,
        color: "Gris Chalk", fuelType: "Gasolina", transmission: "Automático",
        engine: "3.0 Biturbo 450cv", doors: 2,
        description: "El icónico 911 en su versión Carrera S. Motor bóxer trasero de 450cv, PDK de 8 velocidades. Certificado Porsche Approved con 2 años de garantía.",
        basePrice: 128000,
        photos: [
          "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=800&q=80",
          "https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=800&q=80",
        ],
      },
      {
        id: "seed-mercedes-amg-gt-2023",
        title: "Mercedes-AMG GT 63 S 2023",
        brand: "Mercedes-Benz", model: "AMG GT 63 S", year: 2023, mileage: 5100,
        color: "Negro Obsidiana", fuelType: "Gasolina", transmission: "Automático",
        engine: "4.0 V8 Biturbo 639cv", doors: 4,
        description: "El AMG GT 63 S E Performance combina potencia brutal con el lujo Mercedes. 639cv, 0-100 en 3.2s. Asientos AMG Performance, burmester 3D surround sound.",
        basePrice: 175000,
        photos: [
          "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80",
          "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80",
        ],
      },
      {
        id: "seed-ferrari-f8-2022",
        title: "Ferrari F8 Tributo 2022",
        brand: "Ferrari", model: "F8 Tributo", year: 2022, mileage: 3200,
        color: "Rojo Corsa", fuelType: "Gasolina", transmission: "Automático",
        engine: "3.9 V8 Twin-Turbo 720cv", doors: 2,
        description: "El Ferrari F8 Tributo es el homenaje al mejor motor V8 de la historia. 720cv, 0-100 en 2.9s, velocidad máxima 340 km/h. Procedencia italiana con pedigree certificado.",
        basePrice: 280000,
        photos: [
          "https://images.unsplash.com/photo-1592198084033-aade902d1aae?w=800&q=80",
          "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=80",
        ],
      },
      {
        id: "seed-lamborghini-urus-2023",
        title: "Lamborghini Urus S 2023",
        brand: "Lamborghini", model: "Urus S", year: 2023, mileage: 6800,
        color: "Giallo Belen", fuelType: "Gasolina", transmission: "Automático",
        engine: "4.0 V8 Biturbo 666cv", doors: 5,
        description: "El Super SUV por excelencia. 666cv, 0-100 en 3.5s, velocidad máxima 305 km/h. Configuración completa con alcantara, carbono interior y pack estética exterior.",
        basePrice: 245000,
        photos: [
          "https://images.unsplash.com/photo-1621135802920-133df287f89c?w=800&q=80",
          "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80",
        ],
      },
      {
        id: "seed-bentley-continental-2022",
        title: "Bentley Continental GT V8 2022",
        brand: "Bentley", model: "Continental GT V8", year: 2022, mileage: 18000,
        color: "Blanco Glacier", fuelType: "Gasolina", transmission: "Automático",
        engine: "4.0 V8 Biturbo 550cv", doors: 2,
        description: "Lujo y rendimiento en perfecta armonía. El Continental GT V8 con interior en cuero Latte y madera de nogal, techo Naim for Bentley y frenos de carbono-cerámica.",
        basePrice: 210000,
        photos: [
          "https://images.unsplash.com/photo-1631295868223-63265b40d9e4?w=800&q=80",
          "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800&q=80",
        ],
      },
      {
        id: "seed-audi-rs6-2023",
        title: "Audi RS6 Avant Performance 2023",
        brand: "Audi", model: "RS6 Avant Performance", year: 2023, mileage: 11000,
        color: "Gris Nardo", fuelType: "Gasolina", transmission: "Automático",
        engine: "4.0 TFSI V8 630cv", doors: 5,
        description: "El familiar más rápido del mundo. 630cv, 0-100 en 3.4s. Quattro, RS sport exhaust, paquete exterior carbono. El equilibrio perfecto entre practicidad y prestaciones.",
        basePrice: 138000,
        photos: [
          "https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?w=800&q=80",
          "https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&q=80",
        ],
      },
      {
        id: "seed-maserati-grecale-2023",
        title: "Maserati Grecale Trofeo 2023",
        brand: "Maserati", model: "Grecale Trofeo", year: 2023, mileage: 7300,
        color: "Azul Notturno", fuelType: "Gasolina", transmission: "Automático",
        engine: "3.0 V6 Nettuno 530cv", doors: 5,
        description: "El SUV sport premium italiano con el motor Nettuno de F1. 530cv, 0-100 en 3.8s. Interior en cuero pieno fiore, sonido Sonus Faber, techo panorámico solar.",
        basePrice: 115000,
        photos: [
          "https://images.unsplash.com/photo-1490902931801-d6f80ca94fe4?w=800&q=80",
          "https://images.unsplash.com/photo-1502161254066-6c74afbf07aa?w=800&q=80",
        ],
      },
      {
        id: "seed-range-rover-sv-2023",
        title: "Range Rover SV Autobiography 2023",
        brand: "Land Rover", model: "Range Rover SV Autobiography", year: 2023, mileage: 9200,
        color: "Plata Eiger", fuelType: "Gasolina", transmission: "Automático",
        engine: "5.0 V8 Supercharged 565cv", doors: 5,
        description: "La cúspide del lujo todo-terreno. Configuración SV con cuero semi-anilina, madera de nogal veteado, refrigeración de asientos y el sistema de audio Meridian Signature.",
        basePrice: 195000,
        photos: [
          "https://images.unsplash.com/photo-1625231345018-c8f72d8c9a70?w=800&q=80",
          "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&q=80",
        ],
      },
      {
        id: "seed-tesla-model-s-2023",
        title: "Tesla Model S Plaid 2023",
        brand: "Tesla", model: "Model S Plaid", year: 2023, mileage: 4100,
        color: "Rojo Multicoat", fuelType: "Eléctrico", transmission: "Automático",
        engine: "Tri Motor AWD 1020cv", doors: 4,
        description: "El berlina eléctrica más rápida del mundo. 1020cv, 0-100 en 2.1s, autonomía 637km WLTP. Autopilot, pantalla de juego de 17\", butacas con calefacción y ventilación.",
        basePrice: 108000,
        photos: [
          "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&q=80",
          "https://images.unsplash.com/photo-1561580125-028ee3bd62eb?w=800&q=80",
        ],
      },
      {
        id: "seed-mc-laren-720s-2021",
        title: "McLaren 720S 2021",
        brand: "McLaren", model: "720S", year: 2021, mileage: 12800,
        color: "Naranja Papaya", fuelType: "Gasolina", transmission: "Automático",
        engine: "4.0 V8 Twin-Turbo 720cv", doors: 2,
        description: "Superdeportivo con carrocería de carbono. 720cv, 0-100 en 2.9s, 341 km/h. Suspensión activa Proactive Chassis Control II, asientos de carbono con correas de carreras.",
        basePrice: 265000,
        photos: [
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
          "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80",
        ],
      },
      {
        id: "seed-rolls-royce-ghost-2022",
        title: "Rolls-Royce Ghost 2022",
        brand: "Rolls-Royce", model: "Ghost", year: 2022, mileage: 16000,
        color: "Negra Diamante", fuelType: "Gasolina", transmission: "Automático",
        engine: "6.75 V12 Biturbo 571cv", doors: 4,
        description: "Arquitectura de aluminio espaceframe, tracción integral. Boiserie de madera iluminada 'Gallery', tapicería perforada a mano, sistema de audio Bespoke.",
        basePrice: 340000,
        photos: [
          "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80",
          "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&q=80",
        ],
      },
    ];

    let created = 0;
    let skipped = 0;

    for (const car of cars) {
      const { photos, ...carData } = car;
      const finalPrice = Math.round(carData.basePrice * 1.28 * 100) / 100;

      const existing = await prisma.car.findUnique({ where: { id: carData.id } });
      if (existing) { skipped++; continue; }

      await prisma.car.create({
        data: {
          ...carData,
          markup: 28,
          finalPrice,
          status: "PUBLISHED",
          source: "ADMIN",
          isPublished: true,
          submittedById: admin.id,
          approvedById: admin.id,
          approvedAt: new Date(),
          photos: {
            create: photos.map((url, i) => ({
              url,
              filename: `photo-${i + 1}.jpg`,
              order: i,
            })),
          },
        },
      });
      created++;
    }

    return NextResponse.json({ ok: true, created, skipped, message: `Seed completado: ${created} coches creados, ${skipped} ya existían.` });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
