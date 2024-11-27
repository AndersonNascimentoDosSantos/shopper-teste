// src/pages/History.tsx

import React, { useState } from "react";
import api from "../services/api";

const History: React.FC = () => {
  const [customerId, setCustomerId] = useState("");
  const [rides, setRides] = useState([]);
  const [driverId, setDriverId] = useState("");
  const [error, setError] = useState("");

  const handleFetchRides = async () => {
    setError("");
    try {
      const response = await api.get(`/ride/${customerId}`, {
        params: { driver_id: driverId },
      });
      setRides(response.data.rides);
    } catch (error: any) {
      if (error.response) {
        setError(error.response.data.error_description);
      } else {
        setError("Erro ao buscar histórico de viagens.");
      }
    }
  };

  return (
    <div>
      <h2>Histórico de Viagens</h2>
      <input
        type="text"
        placeholder="ID do Usuário"
        value={customerId}
        onChange={(e) => setCustomerId(e.target.value)}
        required
      />

      <select value={driverId} onChange={(e) => setDriverId(e.target.value)}>
        <option value="">Todos os Motoristas</option>
        {/* Adicione opções para motoristas aqui se necessário */}
      </select>

      <button onClick={handleFetchRides}>Buscar</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul>
        {rides.map((ride: any) => (
          <li key={ride.id}>
            Data e Hora: {new Date(ride.date).toLocaleString()} | Motorista:{" "}
            {ride.driver.name} | Origem: {ride.origin} | Destino:{" "}
            {ride.destination} | Distância: {ride.distance} km | Tempo:{" "}
            {ride.duration} | Valor: R$ {ride.value.toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default History;
