import axios from "axios";
import InstitutionsApi from "./api/institutions.jsx";
import AgreementsApi from "./api/agreements.jsx";
import RequisitionsApi from "./api/requisitions.jsx";
import AccountsApi from "./api/accounts.jsx";
import { HttpMethod } from "./httpMethod.js";
import filterObject from "./utils.js";
import { useMemo } from "react";

const baseUrl = import.meta.env.VITE_PROXY_API_URL;

const NordigenClient = () => {
  const secretId = "66433513-7aed-4d19-bc80-7c9ac2ca0ba2";
  const secretKey =
    "e270957e080f165c9f792106c134ad0706d7c696ded78087acc199ee06fdc364680778124d14efa9cf6521fcf215687d22126755fc160101bc3fe01862826ee9";
  let token = "";
  let headers = {
    accept: "application/json",
    "Content-Type": "application/json",
  };
  const endpoint = "token";

  // Function to handle requests
  const request = async ({ endpoint, parameters, method = HttpMethod.GET }) => {
    const url = new URL(`${baseUrl}/${endpoint}`);
    const validParams = filterObject(parameters);

    if (method === HttpMethod.GET && Object.keys(validParams).length > 0) {
      url.search = new URLSearchParams(validParams);
    }
    try {
      const response = await axios({
        headers: headers,
        method,
        url,
        ...(method !== HttpMethod.GET
          ? { data: JSON.stringify(parameters) }
          : {}),
      });
      console.log(headers)
      console.log(url)
      if (!response.ok) {
        const errorData = await response.json(); // Parse the error response
        console.error("Error Response:", errorData);
        return;
      }

      return response.data;
    } catch (error) {
      console.log("Error in request:", error);
      console.log(error.response?.data);

      throw error;
    }
  };
  const client = useMemo(() => ({ request }), []);
  const institution = useMemo(() => InstitutionsApi({ client }), [client]);
  const requisition = useMemo(() => RequisitionsApi({ client }), [client]);
  const agreement = useMemo(() => AgreementsApi({ client }), [client]);

  //Function to create an account instance
  const account = (accountId) => {
    return AccountsApi({ client, accountId });
  };

  // Function to generate token
  const generateToken = async () => {
    const payload = {
      secret_key: secretKey,
      secret_id: secretId,
    };
    const response = await request({
      endpoint: "token",
      parameters: payload,
      method: HttpMethod.POST,
    });

    token = response.access;
    headers = {
      ...headers,
      Authorization: `Bearer ${response.access}`,
    };

    return response;
  };

  // Function to exchange token
  const exchangeToken = async (refreshToken) => {
    const payload = { refresh: refreshToken };

    try {
      const response = await request({
        endpoint: `${endpoint}/refresh/`,
        parameters: payload,
        method: HttpMethod.POST,
      });

      return response;
    } catch (error) {
      console.error("Error exchanging token:", error);
      throw error;
    }
  };

  // Return all available functions
  return {
    request,
    generateToken,
    exchangeToken,
    account,
    institution,
    agreement,
    requisition,
  };
};

export default NordigenClient;
