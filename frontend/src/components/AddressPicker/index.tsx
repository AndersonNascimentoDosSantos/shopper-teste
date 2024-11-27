import { useControllableState } from "@/hooks/useControllableState";
import {
  GoogleMap,
  Marker,
  useLoadScript,
  type Libraries,
} from "@react-google-maps/api";
import { useCallback, useEffect, useState } from "react";
import { getAdressDecomposed } from "../GoogleMaps/utils/getAdressDecomposed";
import { PlacesAutocomplete } from "./PlacesAutocomplete";
import { LocationData } from "@/types.d";
// import { type PaginatedApiRespose } from '@/@types/api-response'

const libraries: Libraries = ["places", "geocoding"];

const defaultMapCenter = { lat: -23.5505, lng: -46.6333 };

interface AddressPickerProps {
  value: LocationData;
  onChange?: (value: LocationData) => void;
  initialLocation?: { lat: number; lng: number };
}

export function AddressPicker({
  value: valueProp,
  onChange,
  initialLocation,
}: AddressPickerProps) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY ?? "",
    libraries,
  });

  console.log("env", process.env.REACT_APP_GOOGLE_API_KEY);
  const [value, setValue] = useControllableState<LocationData>({
    prop: valueProp,
    onChange,
  });

  const [userPosition, setUserPosition] = useState<google.maps.LatLng | null>(
    null
  );
  const [location, setLocation] = useState<google.maps.LatLng | null>(null);
  const [address, setAddress] = useState<string | null>(null);

  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>(
    initialLocation ?? defaultMapCenter
  );

  useEffect(() => {
    if (initialLocation && !location) {
      setMapCenter(initialLocation);
    } else {
      setMapCenter(
        location?.toJSON() ?? userPosition?.toJSON() ?? defaultMapCenter
      );
    }
  }, [initialLocation, location, userPosition]);

  const getGeocodePosition = useCallback(
    (latLng: google.maps.LatLng) => {
      const geocoder = new google.maps.Geocoder();

      void geocoder.geocode({ location: latLng }, (results, status) => {
        if (status === "OK" && results) {
          const firstResult = results[0];
          if (firstResult) {
            setLocation(firstResult.geometry.location);
            setAddress(firstResult.formatted_address);
            const decomposedAddress = getAdressDecomposed(
              firstResult.address_components
            );
            setValue({
              lat: latLng.lat(),
              lng: latLng.lng(),
              bairro: decomposedAddress.bairro,
              cep: decomposedAddress.cep,
              cidade: decomposedAddress.cidade,
              estado: decomposedAddress.estado,
              pais: decomposedAddress.pais,
              rua: decomposedAddress.rua,
            });
          }
        }
      });
    },
    [setValue]
  );

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) getGeocodePosition(e.latLng);
  };

  useEffect(() => {
    if (typeof navigator !== "undefined" && "geolocation" in navigator) {
      if ("google" in window && "maps" in window.google) {
        navigator.geolocation.getCurrentPosition((position) => {
          const { latitude, longitude } = position.coords;
          setUserPosition(new window.google.maps.LatLng(latitude, longitude));
        });
      }
    }
  }, []);

  useEffect(() => {
    if ("google" in window && "maps" in window.google) {
      if (value?.lat && value?.lng) {
        getGeocodePosition(new window.google.maps.LatLng(value.lat, value.lng));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value?.lat, value?.lng]);
  // useEffect(() => {
  //   console.log(initialLocation)
  // }, [initialLocation])

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps</div>;

  return (
    <div className="relative">
      <div className="mb-4">
        <PlacesAutocomplete
          value={value}
          onChange={setValue}
          address={address}
          onChangeAddress={setAddress}
          onChangeLocation={setLocation}
        />
      </div>

      <GoogleMap
        mapContainerStyle={{
          width: "100%",
          height: "400px",
        }}
        center={mapCenter}
        zoom={10}
        onClick={handleMapClick}
      >
        {location && (
          <Marker
            draggable
            position={location}
            onDragEnd={(e) => {
              if (e.latLng !== null) {
                const newLat: number = e.latLng.lat();
                const newLng: number = e.latLng.lng();
                const newLocation = new google.maps.LatLng(newLat, newLng);
                getGeocodePosition(newLocation);
              }
            }}
          />
        )}
      </GoogleMap>
    </div>
  );
}
