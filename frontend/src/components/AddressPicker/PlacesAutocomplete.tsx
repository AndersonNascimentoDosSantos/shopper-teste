import { Command, CommandGroup, CommandItem } from "@/components/ui/Command";
import { useControllableState } from "@/hooks/useControllableState";
import { cn } from "@/lib/utils";
import { CheckIcon } from "@radix-ui/react-icons";
import { Command as CommandPrimitive } from "cmdk";
import { useEffect, useState } from "react";
import usePlacesAutocompleteService from "react-google-autocomplete/lib/usePlacesAutocompleteService";

import { getAdressDecomposed } from "../GoogleMaps/utils/getAdressDecomposed";
import { LocationData } from "@/types.d";

interface PlacesAutocompleteProps {
  value?: LocationData;
  onChange?: (value: LocationData) => void;
  address?: string | null;
  onChangeAddress?: (value: string | null) => void;
  onChangeLocation?: (value: google.maps.LatLng | null) => void;
}

export function PlacesAutocomplete({
  value: valueProp,
  onChange,
  address,
  onChangeAddress,
  onChangeLocation,
}: PlacesAutocompleteProps) {
  const [value, setValue] = useControllableState<LocationData>({
    prop: valueProp,
    onChange,
  });
  const [open, setOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] =
    useState<google.maps.places.AutocompletePrediction | null>(null);
  const [inputValue, setInputValue] = useState(address ?? "");

  const { placesService, placePredictions, getPlacePredictions } =
    usePlacesAutocompleteService({
      apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
      libraries: ["places", "geometry"],
    });

  console.log(placesService, placePredictions, getPlacePredictions);
  useEffect(() => {
    // fetch place details for the first element in placePredictions array
    if (selectedPlace?.place_id)
      placesService?.getDetails(
        {
          placeId: selectedPlace.place_id,
        },
        (placeDetails) => {
          onChangeAddress?.(placeDetails?.formatted_address ?? null);
          onChangeLocation?.(placeDetails?.geometry?.location ?? null);

          const decomposedAddress = getAdressDecomposed(
            placeDetails?.address_components
          );

          if (placeDetails?.geometry?.location) {
            setValue({
              lat: placeDetails?.geometry?.location?.lat(),
              lng: placeDetails?.geometry?.location?.lng(),
              bairro: decomposedAddress.bairro,
              cep: decomposedAddress.cep,
              cidade: decomposedAddress.cidade,
              estado: decomposedAddress.estado,
              pais: decomposedAddress.pais,
              rua: decomposedAddress.rua,
            });
          }
        }
      );

    // se colocar o `setValue` nas dependências entra em loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onChangeAddress, onChangeLocation, placesService, selectedPlace]);

  useEffect(() => {
    // Atualiza o valor do input quando placeSelected mudar
    setInputValue(address ?? "");
  }, [address]);

  return (
    <Command className="overflow-visible bg-transparent">
      <div className="relative w-full rounded-2xl border border-neutral-50 bg-neutral-10 p-4 text-white focus-within:border-white">
        <CommandPrimitive.Input
          onBlur={() => {
            setOpen(false);
          }}
          onFocus={() => {
            setOpen(true);
          }}
          className="ml-2 w-full flex-1 bg-transparent outline-none placeholder:text-neutral-50"
          placeholder="Pesquisar o endereço"
          onValueChange={(evt) => {
            // getPlacePredictions({ input: evt });
            setInputValue(evt);
          }}
          value={inputValue}
        />
      </div>

      {/* <div className="relative mt-1">
        {open && placePredictions.length > 0 && (
          <div className="animate-in absolute top-0 z-10 w-full overflow-hidden rounded-2xl bg-neutral-20 text-white shadow-lg outline-none">
            <CommandGroup className="h-full max-h-96 overflow-auto">
              {placePredictions?.map((prediction) => (
                <CommandItem
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  key={prediction.place_id}
                  value={prediction.description}
                  onSelect={(currentValue) => {
                    if (currentValue === inputValue) {
                      setInputValue("");
                      setSelectedPlace(null);
                      setValue(undefined);
                    } else {
                      setInputValue(currentValue);
                      setSelectedPlace(prediction);
                    }

                    setOpen(false);
                  }}
                >
                  {prediction.description}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      inputValue === prediction.description
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </div>
        )}
      </div> */}
    </Command>
  );
}
