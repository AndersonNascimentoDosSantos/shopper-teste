import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const drivers = [
    {
      name: "Homer Simpson",
      description:
        "Olá! Sou o Homer, seu motorista camarada! Relaxe e aproveite o passeio, com direito a rosquinhas e boas risadas (e talvez alguns desvios).",
      vehicle: "Plymouth Valiant 1973 rosa e enferrujado",
      rating: 2,
      pricePerKm: 2.5,
    },
    {
      name: "Dominic Toretto",
      description:
        "Ei, aqui é o Dom. Pode entrar, vou te levar com segurança e rapidez ao seu destino. Só não mexa no rádio, a playlist é sagrada.",
      vehicle: "Dodge Charger R/T 1970 modificado",
      rating: 4,
      pricePerKm: 5.0,
    },
    {
      name: "James Bond",
      description:
        "Boa noite, sou James Bond. À seu dispor para um passeio suave e discreto. Aperte o cinto e aproveite a viagem.",
      vehicle: "Aston Martin DB5 clássico",
      rating: 5,
      pricePerKm: 10.0,
    },
  ];

  for (const driver of drivers) {
    await prisma.driver.create({
      data: driver,
    });
  }

  console.log("Motoristas criados!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
