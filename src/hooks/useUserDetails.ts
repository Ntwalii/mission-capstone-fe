import useAxios from "axios-hooks";
import { apiUrl } from "../utils/authApiUrl";

export default function useUserDetails() {
  return useAxios(
    {
      url: `${apiUrl}/validate`,
      method: "GET",
    },
    { manual: true }
  );
}