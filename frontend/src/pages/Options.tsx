// src/pages/Options.tsx

import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "@/services/api";

const Options: React.FC = () => {
  const location = useLocation();
  const { customer_id, options, routeResponse } = location.state || {};
  const navigate = useNavigate();
  const [error, setError] = React.useState("");

  const handleConfirm = async (driver: any) => {
    setError("");
    console.log(routeResponse.origin);
    try {
      await api.patch("/ride/confirm", {
        customer_id: customer_id,
        origin: routeResponse.origin,
        destination: routeResponse.destination,
        distance: routeResponse.distance,
        duration: routeResponse.duration,
        driver,
        value: driver.value,
      });
      navigate("/history", { state: { customer_id } });
    } catch (error: any) {
      if (error.response) {
        setError(error.response.data.error_description);
      } else {
        setError("Erro ao confirmar a viagem.");
      }
    }
  };

  return (
    <div>
      <h2>Opções de Motoristas</h2>
      {/* Aqui você pode integrar um mapa estático usando uma biblioteca como Google Maps ou Leaflet */}
      <h3>Rota:</h3>
      {/* Exibir informações da rota */}
      {options.map((driver: any) => (
        <div key={driver.id}>
          <h4>{driver.name}</h4>
          <p>{driver.description}</p>
          <p>{driver.vehicle}</p>
          <p>Avaliação: {driver.review.rating}</p>
          <p>Valor Total: R$ {driver.value.toFixed(2)}</p>
          <button onClick={() => handleConfirm(driver)}>Escolher</button>
        </div>
      ))}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default Options;