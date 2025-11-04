import { apiUrl } from "@/utils/apiUrl";
import useAxios from "axios-hooks";
import { getAuthToken } from "@/utils/auth";
export default function useContinents() {
  return useAxios(
    {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
      url: `${apiUrl}/v1/items/stats/continents`,
      method: "GET",
    },
    { manual: true }
  );
}
