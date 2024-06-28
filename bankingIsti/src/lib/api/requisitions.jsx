import React from "react";
import { HttpMethod } from "../httpMethod.js";

class RequisitionsApi extends React.Component {
  constructor({ client }) {
    super();
    this.endpoint = "requisitions";
    this.client = client;
  }

  createRequisition({
    redirectUrl,
    institutionId,
    agreement,
    userLanguage,
    redirectImmediate = false,
    accountSelection = false,
    reference = null,
    ssn = null,
  }) {
    const payload = {
      redirect: redirectUrl,
      institution_id: institutionId,
      redirect_immediate: redirectImmediate,
      account_selection: accountSelection,
      ...(userLanguage && { user_language: userLanguage }),
      ...(agreement && { agreement: agreement }),
      ...(ssn && { ssn: ssn }),
      ...(reference && { reference: reference }),
    };

    return this.client.request({
      endpoint: `${this.endpoint}/`,
      parameters: payload,
      method: HttpMethod.POST,
    });
  }

  getRequisitions({ limit = 100, offset = 0 } = {}) {
    const params = { limit, offset };
    return this.client.request({
      endpoint: `${this.endpoint}/`,
      method: HttpMethod.GET,
      parameters: params,
    });
  }

  getRequisitionById(requisitionId) {
    return this.client.request({
      endpoint: `${this.endpoint}/${requisitionId}/`,
    });
  }

  deleteRequisition(requisitionId) {
    return this.client.request({
      endpoint: `${this.endpoint}/${requisitionId}/`,
      method: HttpMethod.DELETE,
    });
  }

  render() {
    return null; // Or you can return any UI component if needed
  }
}

export default RequisitionsApi;
