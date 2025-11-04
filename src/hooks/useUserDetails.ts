import useAxios from "axios-hooks";
import { apiUrl } from "../utils/authApiUrl";

export default function useUserDetails() {
  return useAxios(
    {
      url: `${apiUrl}/auth/validate`,
      method: "GET",
    },
    { manual: true }
  );
}
