// src/pages/RequestRide.tsx

import React, { useMemo, useState } from "react";
import api from "@/services/api";
import { useNavigate } from "react-router-dom";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { LocationData, locationSchema } from "@/types.d";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  SelectedPlace,
  UberLikeLocationPicker,
} from "@/components/GoogleMaps/GetAdressOnMap";

const RequestRide: React.FC = () => {
  const [customerId, setCustomerId] = useState("");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleEstimate = async () => {
    setError("");

    try {
      const response = await api.post("/ride/estimate", {
        customer_id: customerId,
        origin,
        destination,
      });
      navigate("/options", {
        state: {
          customer_id: customerId,
          options: response.data.options,
          routeResponse: {
            origin: response.data.origin,
            destination: response.data.destination,
            distance: response.data.distance,
            duration: response.data.duration,
          },
        },
      });
    } catch (error: any) {
      console.log(error);
      if (error.response) {
        setError(error.response.data.error_description);
      } else {
        setError("Erro ao estimar a viagem.");
      }
    }
  };

  const formDefaultValues = useMemo<{
    location: SelectedPlace;
  }>(
    () => ({
      location: {
        cep: "",
        bairro: "",
        location: undefined,
        cidade: "",
        pais: "",
        estado: "",
        rua: "",
      },
    }),
    []
  );

  const {
    watch,
    reset,
    setValue,
    setError: setFormError,
    ...form
  } = useForm<{ location: SelectedPlace }>({
    resolver: zodResolver(locationSchema),
    defaultValues: formDefaultValues,
  });
  const [selectedPlace, setSelectedPlace] = useState<SelectedPlace>(
    {} as SelectedPlace
  );
  return (
    <div>
      <h2>Solicitação de Viagem</h2>
      <Form {...{ ...form, watch, reset, setValue, setError: setFormError }}>
        <form
          onSubmit={form.handleSubmit(handleEstimate)}
          className=" block w-full space-y-8"
        >
          <input
            type="text"
            placeholder="ID do Usuário"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            required
          />
          <div>
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Endereço*</FormLabel>
                    <FormControl>
                      <UberLikeLocationPicker />
                    </FormControl>
                    <FormMessage {...field} />
                  </FormItem>
                );
              }}
            />
          </div>
          <input
            type="text"
            placeholder="Origem"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Destino"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            required
          />
          <button type="submit">Estimar Viagem</button>
        </form>
      </Form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default RequestRide;
