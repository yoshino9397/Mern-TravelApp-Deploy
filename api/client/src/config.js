import axios from "axios";

const BASE_URL = "https://yoshino-travelmap.herokuapp.com/api/";

export const publicRequest = axios.create({
  baseURL: BASE_URL,
});
