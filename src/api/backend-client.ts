import ky from "ky";

const backendBaseUrl =
  import.meta.env.VITE_BACKEND_API_BASE_URL ?? "http://localhost:8080";

export const backendClient = ky.create({
  baseUrl: `${backendBaseUrl}/`,
});
