import * as z from "zod";

// export interface LocationData {
//   lat: number;
//   lng: number;
//   rua: string;
//   cidade: string;
//   pais: string;
//   estado: string;
//   bairro: string;
//   cep: string;
// }

export const locationSchema = z.object({
  lat: z.number({ errorMap: () => ({ message: "Latitude requerida" }) }),
  lng: z.number({ errorMap: () => ({ message: "Longitude requerida" }) }),
  rua: z
    .string({
      // required_error: 'Rua requerida',
      errorMap: () => ({ message: "Rua requerida" }),
    })
    .trim()
    .min(1),
  cidade: z
    .string({
      // required_error: 'Cidade requerida',
      errorMap: () => ({ message: "Cidade requerida" }),
    })
    .trim()
    .min(1),
  pais: z
    .string({
      // required_error: 'País requerido',
      errorMap: () => ({ message: "País requerido" }),
    })
    .trim()
    .min(1),
  estado: z
    .string({
      // required_error: 'Estado requerido',
      errorMap: () => ({ message: "Estado requerido" }),
    })
    .trim()
    .min(1),
  bairro: z
    .string({
      // required_error: 'Bairro requerido',
      errorMap: () => ({ message: "Bairro requerido" }),
    })
    .trim()
    .min(1),
  cep: z
    .string()
    .trim()
    .refine((arg) => removeNumberFormat(arg).length === 8, {
      message: "CEP requerido",
    }),
});

export type LocationData = z.infer<typeof locationSchema>;
