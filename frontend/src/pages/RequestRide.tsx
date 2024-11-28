// src/pages/RequestRide.tsx

import React, { FormEvent, FormEventHandler, useState } from "react";
import api from "@/services/api";
import { useNavigate } from "react-router-dom";
import { FormControl, FormItem, FormLabel } from "@/components/ui/form";

import {
  SelectedPlace,
  UberLikeLocationPicker,
} from "@/components/GoogleMaps/GetAdressOnMap";
import { Input } from "@/components/ui/input";

const RequestRide: React.FC = () => {
  const [customerId, setCustomerId] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const [selectedPlaceOrigin, setSelectedPlaceOrigin] = useState<SelectedPlace>(
    {} as SelectedPlace
  );
  const [selectedPlaceDestin, setSelectedPlaceDestin] = useState<SelectedPlace>(
    {} as SelectedPlace
  );
  const handleEstimate = async (e: FormEvent<HTMLFormElement>) =>
    //   data: {
    //   destination: string;
    //   origin: string;
    //   customerId: string;
    //   location: SelectedPlace;
    // }

    {
      e.preventDefault();
      setError("");

      try {
        const response = await api.post("/ride/estimate", {
          customer_id: customerId,
          origin: selectedPlaceOrigin.address,
          destination: selectedPlaceDestin.address,
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

  return (
    <div>
      <h2>Solicitação de Viagem</h2>
      <form onSubmit={handleEstimate} className=" block w-full space-y-8">
        <div className="flex items-center gap-2">
          <Input
            type="text"
            placeholder="ID do Usuário"
            value={customerId}
            onChange={(e) => {
              console.log(e.target.value);
              setCustomerId(e.target.value);
            }}
            required
            className="w-80 rounded-2xl border border-b-neutral-500 bg-neutral-10 py-2  my-2 focus:border-b-neutral-700 focus:outline-none"
          />

          <button
            type="submit"
            className="my-4 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Estimar Viagem
          </button>
        </div>
        <div>
          <label>Endereço*</label>

          <UberLikeLocationPicker
            {...{
              selectedPlaceOrigin,
              setSelectedPlaceOrigin,
              selectedPlaceDestin,
              setSelectedPlaceDestin,
            }}
          />
        </div>
        {/* <FormField
            control={form.control}
            name="origin"
            render={({ field: { onChange, ...field } }) => {
              return (
                <Input
                  hidden
                  type="text"
                  placeholder="Origem"
                  value={selectedPlaceOrigin.address}
                  required
                />
              );
            }}
          />
          <FormField
            control={form.control}
            name="customerId"
            render={({ field: { onChange, ...field } }) => {
              return (
                <Input
                  hidden
                  type="text"
                  placeholder="Destino"
                  value={selectedPlaceDestin.address}
                  required
                />
              );
            }}
          /> */}
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default RequestRide;
