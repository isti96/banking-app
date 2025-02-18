import axios from "axios";
import InstitutionsApi from "./api/institutions.jsx";
import AgreementsApi from "./api/agreements.jsx";
import RequisitionsApi from "./api/requisitions.jsx";
import AccountsApi from "./api/accounts.jsx";
import { HttpMethod } from "./httpMethod.js";
import filterObject from "./utils.js";
import { useMemo } from "react";
import "dotenv/config";

const baseUrl = process.env.PROXY_API_URL;

const NordigenClient = () => {
  const secretId = "0bdfe1c7-25c6-4433-a685-57a58f01f52e";
  const secretKey =
    "3a43e9946adf064310d0bb5cd6ff91907d792b7c04e1076ec2222bd68a7058d989ae8495e5c5f11086001b0c0af19434d0979c5fa2afd7ecc7c815836b76ce9b";
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

      return response.data;
    } catch (error) {
      console.error("Error in request:", error);
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
      endpoint: `${endpoint}/new/`,
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
