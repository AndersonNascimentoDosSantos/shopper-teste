interface AddressData {
  rua: string;
  bairro: string;
  cidade: string;
  pais: string;
  cep: string;
  estado: string;
}

export function getAdressDecomposed(
  addressComponents?: google.maps.GeocoderAddressComponent[]
) {
  const addressInfo: AddressData = {} as AddressData;

  // console.log(addressInfo);
  addressComponents?.forEach((component) => {
    const { long_name, types } = component;

    if (types.includes("street_number")) {
      if (long_name) addressInfo.rua = long_name;
    } else if (types.includes("route")) {
      addressInfo.rua += " " + long_name;
    } else if (
      types.includes("sublocality") ||
      types.includes("sublocality_level_1")
    ) {
      addressInfo.bairro = long_name;
    } else if (
      types.includes("locality") ||
      types.includes("administrative_area_level_2")
    ) {
      addressInfo.cidade = long_name;
    } else if (types.includes("country")) {
      addressInfo.pais = long_name;
    } else if (types.includes("postal_code")) {
      addressInfo.cep = long_name;
    } else if (types.includes("administrative_area_level_1")) {
      addressInfo.estado = long_name;
    }
  });

  return addressInfo;
}
