import axios from "axios";
import https from "https";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const LANDING_API = `${BASE_URL}/landing_page_data`;

const agent = new https.Agent({
  rejectUnauthorized: false,
});

const fetchData = async (data) => {
  if (!data) return;
  let datanew = await axios.post(LANDING_API, data, { httpsAgent: agent });
  return await datanew;
};

export default fetchData;
