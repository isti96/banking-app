import React from "react";
import axios from "axios";
import InstitutionApi from "./api/institutions.jsx";
import AgreementApi from "./api/agreements.jsx";
import RequisitionsApi from "./api/requisitions.jsx";
import AccountApi from "./api/accounts.jsx";
import { HttpMethod } from "./httpMethod.js";
import filterObject from "./utils.js";

class NordigenClient extends React.Component {
  constructor(props) {
    super(props);
    this.baseUrl = props.baseUrl || "http://localhost:8010/proxy";
    this.secretId = "0bdfe1c7-25c6-4433-a685-57a58f01f52e";
    this.secretKey =
      "3a43e9946adf064310d0bb5cd6ff91907d792b7c04e1076ec2222bd68a7058d989ae8495e5c5f11086001b0c0af19434d0979c5fa2afd7ecc7c815836b76ce9b";
    this.token = "";
    this.headers = {
      accept: "application/json",
      "Content-Type": "application/json",
    };

    this.endpoint = "token";
    this.institution = new InstitutionApi({ client: this });
    this.agreement = new AgreementApi({ client: this });
    this.requisition = new RequisitionsApi({ client: this });
    // this.account = new AccountApi({ client: this });
  }

  async request({ endpoint, parameters, method = HttpMethod.GET }) {
    const url = new URL(`${this.baseUrl}/${endpoint}`);
    const validParams = filterObject(parameters);

    if (method === HttpMethod.GET && Object.keys(validParams).length > 0) {
      url.search = new URLSearchParams(validParams);
    }

    try {
      const response = await axios({
        headers: this.headers,
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
  }

  account(accountId) {
    return new AccountApi({ client: this, accountId: accountId });
  }

  async generateToken() {
    const payload = {
      secret_key: this.secretKey,
      secret_id: this.secretId,
    };

    const response = await this.request({
      endpoint: `${this.endpoint}/new/`,
      parameters: payload,
      method: HttpMethod.POST,
    });

    this.token = response.access;
    this.headers = {
      ...this.headers,
      Authorization: `Bearer ${response.access}`,
    };
    return response;
  }

  async exchangeToken({ refreshToken }) {
    const payload = { refresh: refreshToken };

    try {
      const response = await this.request({
        endpoint: `${this.endpoint}/refresh/`,
        parameters: payload,
        method: HttpMethod.POST,
      });

      return response;
    } catch (error) {
      console.error("Error exchanging token:", error);
      throw error;
    }
  }

  render() {
    return; // Or you can return any UI component if needed
  }
}

export default NordigenClient;
