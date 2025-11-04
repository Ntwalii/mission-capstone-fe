import { apiUrl } from "@/utils/apiUrl";
import useAxios from "axios-hooks";
import { getAuthToken } from "@/utils/auth";
export default function useMarkets() {
  return useAxios(
    {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
      url: `${apiUrl}/v1/items/market/opportunities`,
      method: "GET",
    },
    { manual: true }
  );
}
