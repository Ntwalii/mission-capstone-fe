import useAxios from "axios-hooks";
import { apiUrl } from "../utils/authApiUrl";

export default function useLogin() {
  return useAxios(
    {
      url: `${apiUrl}/login`,
      method: "POST",
    },
    { manual: true }
  );
}