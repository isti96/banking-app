import React from 'react';
import { HttpMethod } from '../httpMethod.js';

class AgreementApi extends React.Component {
  constructor({ client }) {
    super();
    this.endpoint = "agreements/enduser";
    this.client = client;
  }

  createAgreement({ institutionId, maxHistoricalDays = 90, accessValidForDays = 90, accessScope = [
    "balances",
    "details",
    "transactions"
  ] }) {
    const payload = {
      "institution_id": institutionId,
      "max_historical_days": maxHistoricalDays,
      "access_valid_for_days": accessValidForDays,
      "access_scope": accessScope,
    };

    return this.client.request({
      endpoint: `${this.endpoint}/`,
      parameters: payload,
      method: HttpMethod.POST
    });
  }

  getAgreements({ limit = 100, offset = 0 } = {}) {
    const params = { limit, offset };

    return this.client.request({
      endpoint: `${this.endpoint}`,
      parameters: params
    });
  }

  getAgreementById(agreementId) {
    return this.client.request({
      endpoint: `${this.endpoint}/${agreementId}/`
    });
  }

  deleteAgreement(agreementId) {
    return this.client.request({
      endpoint: `${this.endpoint}/${agreementId}/`,
      method: HttpMethod.DELETE
    });
  }

  acceptAgreement({ agreementId, ip, userAgent }) {
    const payload = {
      'user_agent': userAgent,
      'ip_address': ip
    }

    return this.client.request({
      endpoint: `${this.endpoint}/${agreementId}/accept/`,
      parameters: payload,
      method: HttpMethod.PUT
    });
  }

  render() {
    return null; // Or you can return any UI component if needed
  }
}

export default AgreementApi;