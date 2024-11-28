import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  GoogleMap,
  Marker,
  useLoadScript,
  Libraries,
} from "@react-google-maps/api";
import { getAdressDecomposed } from "../utils/getAdressDecomposed";
import GooglePlacesAutocomplete from "./AutocompletInput";

const mapContainerStyle = {
  width: "100%",
  height: "500px",
};
const libraries: Libraries = ["places", "geocoding"];

const DEFAULT_CENTER = { lat: -23.5505, lng: -46.6333 }; // São Paulo

export interface SelectedPlace {
  address?: string;
  location: google.maps.LatLng | undefined;
}

interface IUberLike {
  selectedPlaceOrigin: SelectedPlace;
  setSelectedPlaceOrigin: Dispatch<SetStateAction<SelectedPlace>>;
  selectedPlaceDestin: SelectedPlace;
  setSelectedPlaceDestin: Dispatch<SetStateAction<SelectedPlace>>;
}
export const UberLikeLocationPicker = ({
  selectedPlaceDestin: destination,
  selectedPlaceOrigin: origin,
  setSelectedPlaceDestin: setDestination,
  setSelectedPlaceOrigin: setOrigin,
}: IUberLike) => {
  // const [origin, setOrigin] = useState<SelectedPlace>({
  //   location: undefined,
  //   address: "",
  // });

  // const [destination, setDestination] = useState<SelectedPlace>({
  //   location: undefined,
  //   address: "",
  // });

  const [userLocation, setUserLocation] = useState<google.maps.LatLng | null>(
    null
  );

  const [editMode, setEditMode] = useState<"origin" | "destination" | null>(
    null
  );

  const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY ?? "",
    libraries,
  });

  // Improved geolocation with fallback
  const getCurrentLocation = useCallback(() => {
    return new Promise<google.maps.LatLng>((resolve) => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve(
              new window.google.maps.LatLng(
                position.coords.latitude,
                position.coords.longitude
              )
            );
          },
          () =>
            resolve(
              new window.google.maps.LatLng(
                DEFAULT_CENTER.lat,
                DEFAULT_CENTER.lng
              )
            )
        );
      } else {
        resolve(
          new window.google.maps.LatLng(DEFAULT_CENTER.lat, DEFAULT_CENTER.lng)
        );
      }
    });
  }, []);

  // Initialize location on component mount
  useEffect(() => {
    if (isLoaded && !origin.location) {
      getCurrentLocation().then((location) => {
        setUserLocation(location);
        setMapCenter(location.toJSON());
        if (!origin.location) {
          setOrigin((prevOrigin) => ({ ...prevOrigin, location }));
        }
      });
    }
  }, [isLoaded, getCurrentLocation, origin.location, setOrigin]);

  const geocodeLatLng = useCallback(
    (latLng: google.maps.LatLng) => {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: latLng }, (results, status) => {
        if (status === "OK" && results && results[0]) {
          const locationData = {
            address: results[0].formatted_address,
            location: results[0].geometry.location,
            ...getAdressDecomposed(results[0].address_components),
          };

          if (editMode === "origin") {
            setOrigin(locationData);
          } else if (editMode === "destination") {
            setDestination(locationData);
          }

          // Update map center
          setMapCenter(results[0].geometry.location.toJSON());
        }
      });
    },
    [editMode, setDestination, setOrigin]
  );

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps</div>;

  const onMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng && editMode) {
      geocodeLatLng(e.latLng);
      setEditMode(null); // Reset edit mode after setting the location
    }
  };

  const startLocationEdit = (mode: "origin" | "destination") => {
    setEditMode(mode);
  };

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <h3 className="mb-2 text-lg font-semibold">Destino</h3>
          <GooglePlacesAutocomplete
            placeSelected={destination}
            SetPlaceSelected={(place) => {
              // console.log("Novo destino selecionado:", place);
              setDestination(place);
              // Atualizar o centro do mapa para o novo destino
              if (place.location) {
                setMapCenter(place.location.toJSON());
              }
            }}
          />
          <button
            type="button"
            onClick={() => startLocationEdit("destination")}
            className="px-3 py-2 bg-green-400 text-white rounded hover:bg-green-500"
          >
            Alterar destino
          </button>
        </div>
        <div>
          <h3 className="mb-2 text-lg font-semibold">Origem</h3>
          <div className="flex  flex-col space-x-2">
            <div className="bg-neutral-10 p-3 rounded-lg">
              <p>{origin.address || "Localização atual"}</p>
            </div>
            <button
              type="button"
              onClick={() => startLocationEdit("origin")}
              className="px-3 py-2 bg-blue-400 text-white rounded hover:bg-blue-500"
            >
              Aletar Ponto de partida
            </button>
          </div>
        </div>
      </div>

      <div className="relative">
        {editMode && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 bg-white p-2 rounded-lg shadow-md">
            {editMode === "origin"
              ? "Clique no mapa para definir a origem"
              : "Clique no mapa para definir o destino"}
          </div>
        )}
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={mapCenter}
          zoom={15}
          onClick={onMapClick}
        >
          {origin.location && (
            <Marker position={origin.location} title="Origem" label="A" />
          )}
          {destination.location && (
            <Marker position={destination.location} title="Destino" label="B" />
          )}
        </GoogleMap>
      </div>

      {destination.location && origin.location && (
        <div className="mt-4 p-4 bg-neutral-10 rounded-lg">
          <h4 className="font-bold mb-2">Detalhes da Viagem:</h4>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <strong>Origem:</strong>
              <p>{origin.address}</p>
              {/* Exibir detalhes adicionais da origem */}
            </div>
            <div>
              <strong>Destino:</strong>
              <p>{destination.address}</p>
              {/* Exibir detalhes adicionais do destino */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
