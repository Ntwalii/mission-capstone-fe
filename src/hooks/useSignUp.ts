import useAxios from "axios-hooks";
import { apiUrl } from "../utils/authApiUrl";

export default function useSignUp() {
  return useAxios(
    {
      url: `${apiUrl}/register`,
      method: "POST",
    },
    { manual: true }
  );
}