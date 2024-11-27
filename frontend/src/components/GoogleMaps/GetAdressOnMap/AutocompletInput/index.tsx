import React, { useState, useEffect, useRef } from "react";
import usePlacesService from "react-google-autocomplete/lib/usePlacesAutocompleteService";
import { getAdressDecomposed } from "../../utils/getAdressDecomposed";
import { SelectedPlace } from "..";

export default function GooglePlacesAutocomplete({
  placeSelected,
  SetPlaceSelected,
}: {
  placeSelected: SelectedPlace;
  SetPlaceSelected: (selectedPlace: SelectedPlace) => void;
}) {
  const [selectedPlace, setSelectedPlace] =
    useState<google.maps.places.AutocompletePrediction>(
      {} as google.maps.places.AutocompletePrediction
    );
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(placeSelected?.address ?? "");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const { placesService, placePredictions, getPlacePredictions } =
    usePlacesService({
      apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
    });

  useEffect(() => {
    if (selectedPlace.place_id) {
      placesService?.getDetails(
        { placeId: selectedPlace.place_id },
        (placeDetails) => {
          SetPlaceSelected({
            address: placeDetails?.formatted_address,
            location: placeDetails?.geometry?.location,
            ...getAdressDecomposed(placeDetails?.address_components),
          });
          // Limpar o valor do input após a seleção
          setValue(placeDetails?.formatted_address || "");
        }
      );
    }
  }, [selectedPlace, placesService, SetPlaceSelected]);

  useEffect(() => {
    setValue(placeSelected?.address ?? "");
  }, [placeSelected]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prevIndex) =>
        Math.min(prevIndex + 1, placePredictions.length - 1)
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    } else if (e.key === "Enter" && highlightedIndex >= 0) {
      e.preventDefault();
      const selectedFramework = placePredictions[highlightedIndex];
      setValue(selectedFramework.description);
      setSelectedPlace(selectedFramework);
      setOpen(false);
    } else if (e.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
    }
  };

  const handleInputChange = (evt: string) => {
    getPlacePredictions({ input: evt });
    setValue(evt);
    setOpen(evt.length > 0);
    setHighlightedIndex(-1);
  };

  return (
    <div className="relative w-full">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => handleInputChange(e.target.value)}
        onFocus={() => setOpen(value.length > 0)}
        onBlur={() => setTimeout(() => setOpen(false), 200)}
        onKeyDown={handleKeyDown}
        placeholder="Search address..."
        className="w-full rounded-2xl border border-neutral-50 bg-neutral-10 p-4 focus:border-white focus:outline-none"
      />

      {open && placePredictions.length > 0 && (
        <ul
          ref={listRef}
          className="absolute z-10 mt-1 w-full rounded-2xl bg-neutral-20 shadow-lg max-h-96 overflow-auto"
        >
          {placePredictions.map((framework, index) => (
            <li
              key={framework.place_id}
              className={`
                p-3 cursor-pointer 
                ${
                  index === highlightedIndex
                    ? "bg-neutral-30"
                    : "hover:bg-neutral-30"
                }
              `}
              onMouseDown={(e) => {
                e.preventDefault();
                setValue(framework.description);
                setSelectedPlace(framework);
                setOpen(false);
              }}
            >
              {framework.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
