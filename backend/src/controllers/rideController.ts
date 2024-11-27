import axios from "axios";
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const drivers = [
  {
    id: 1,
    name: "Homer Simpson",
    description: "Olá! Sou o Homer, seu motorista camarada!",
    vehicle: "Plymouth Valiant 1973 rosa e enferrujado",
    rating: 2,
    pricePerKm: 2.5,
  },
  {
    id: 2,
    name: "Dominic Toretto",
    description: "Ei, aqui é o Dom. Pode entrar!",
    vehicle: "Dodge Charger R/T 1970 modificado",
    rating: 4,
    pricePerKm: 5.0,
  },
  {
    id: 3,
    name: "James Bond",
    description: "Boa noite, sou James Bond.",
    vehicle: "Aston Martin DB5 clássico",
    rating: 5,
    pricePerKm: 10.0,
  },
];

export const estimateRide = async (req: any, res: any) => {
  const { customer_id, origin, destination } = req.body;

  // Validações
  if (!customer_id || !origin || !destination) {
    return res.status(400).json({
      error_code: "INVALID_DATA",
      error_description: "Os campos não podem estar em branco.",
    });
  }
  if (origin === destination) {
    return res.status(400).json({
      error_code: "INVALID_DATA",
      error_description: "Origem e destino não podem ser iguais.",
    });
  }

  try {
    // Chamada à API do Google Maps para calcular a rota
    const googleMapsResponse = await axios.get(
      `https://maps.googleapis.com/maps/api/directions/json`,
      {
        params: {
          origin,
          destination,
          key: process.env.GOOGLE_API_KEY,
          travelMode: "DRIVE",
        },
      }
    );

    const route = googleMapsResponse.data.routes[0];
    const distance = route.legs[0].distance.value / 1000; // em km
    const duration = route.legs[0].duration.text;

    // Calcular valores dos motoristas
    const options = drivers
      .map((driver) => ({
        id: driver.id,
        name: driver.name,
        description: driver.description,
        vehicle: driver.vehicle,
        review: { rating: driver.rating, comment: "" },
        value: driver.pricePerKm * distance,
      }))
      .sort((a, b) => a.value - b.value); // Ordenar pelo valor

    return res.status(200).json({
      origin: route.legs[0].start_location,
      destination: route.legs[0].end_location,
      distance,
      duration,
      options,
      routeResponse: googleMapsResponse.data,
    });
  } catch (error) {
    return res.status(500).json({
      error_code: "INTERNAL_ERROR",
      error_description: "Erro ao calcular a rota.",
    });
  }
};

export const confirmRide = async (req: any, res: any) => {
  const {
    customer_id,
    origin,
    destination,
    distance,
    duration,
    driver,
    value,
  } = req.body;

  // Validações
  if (!customer_id || !origin || !destination) {
    return res.status(400).json({
      error_code: "INVALID_DATA",
      error_description: "Os campos não podem estar em branco.",
    });
  }
  if (origin === destination) {
    return res.status(400).json({
      error_code: "INVALID_DATA",
      error_description: "Origem e destino não podem ser iguais.",
    });
  }
  if (!driver || !driver.id) {
    return res.status(400).json({
      error_code: "INVALID_DATA",
      error_description: "Motorista não informado.",
    });
  }

  // Verificar se o motorista é válido
  const selectedDriver = drivers.find((d) => d.id === driver.id);

  if (!selectedDriver) {
    return res.status(404).json({
      error_code: "DRIVER_NOT_FOUND",
      error_description: "Motorista não encontrado.",
    });
  }

  // Verificar se a distância é válida para o motorista
  if (distance < selectedDriver.pricePerKm * 10) {
    // Exemplo de validação
    return res.status(406).json({
      error_code: "INVALID_DISTANCE",
      error_description: "Quilometragem inválida para o motorista.",
    });
  }

  try {
    // return res.status(200).json({
    //   data: {
    //     customer_id: Number(customer_id),
    //     origin,
    //     destination,
    //     distance,
    //     duration,
    //     driver_id: selectedDriver.id,
    //     value,
    //   },
    // });
    // Salvar a viagem no banco de dados
    await prisma.ride.create({
      data: {
        customer_id: Number(customer_id),
        origin: JSON.stringify(origin),
        destination: JSON.stringify(destination),
        distance,
        duration,
        driver_id: selectedDriver.id,
        value,
      },
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({
      error_code: "INTERNAL_ERROR",
      error_description: "Erro ao salvar a viagem.",
      error,
    });
  }
};

export const getRides = async (req: any, res: any) => {
  const { customer_id } = req.params;
  const { driver_id } = req.query;

  // Validações
  if (!customer_id) {
    return res.status(400).json({
      error_code: "INVALID_DATA",
      error_description: "O ID do usuário não pode estar em branco.",
    });
  }

  try {
    // Buscar as viagens realizadas pelo usuário
    const rides = await prisma.ride.findMany({
      where: {
        customer_id: Number(customer_id),
        ...(driver_id && { driver_id: Number(driver_id) }), // Filtrar por motorista se fornecido
      },
      orderBy: {
        id: "desc", // Ordenar da mais recente para a mais antiga
      },
    });

    if (rides.length === 0) {
      return res.status(404).json({
        error_code: "NO_RIDES_FOUND",
        error_description: "Nenhum registro encontrado.",
      });
    }
    // Verificar se o motorista é válido
    // const selectedDriver = drivers.find((d) => d.id === driver.id);

    return res.status(200).json({
      customer_id,
      rides: rides.map((ride: any) => ({
        id: ride.id,
        date: ride.createdAt, // Supondo que você tenha um campo createdAt
        origin: ride.origin,
        destination: ride.destination,
        distance: ride.distance,
        duration: ride.duration,
        driver: drivers.find((d) => d.id === ride.driver_id) || {}, // Você pode buscar o nome do motorista se necessário
        value: ride.value,
      })),
    });
  } catch (error) {
    return res.status(500).json({
      error_code: "INTERNAL_ERROR",
      error_description: "Erro ao buscar as viagens.",
    });
  }
};
