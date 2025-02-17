import { HttpMethod } from "../httpMethod.js";

const AgreementsApi = ({ client }) => {
  const endpoint = "agreements/enduser";

  const createAgreement = ({
    institutionId,
    maxHistoricalDays = 90,
    accessValidForDays = 90,
    accessScope = ["balances", "details", "transactions"],
  }) => {
    const payload = {
      institution_id: institutionId,
      max_historical_days: maxHistoricalDays,
      access_valid_for_days: accessValidForDays,
      access_scope: accessScope,
    };

    return client.request({
      endpoint: `${endpoint}/`,
      parameters: payload,
      method: HttpMethod.POST,
    });
  };

  const getAgreements = ({ limit = 100, offset = 0 } = {}) => {
    const params = { limit, offset };

    return client.request({
      endpoint: `${endpoint}`,
      parameters: params,
    });
  };

  const getAgreementById = (agreementId) => {
    return client.request({
      endpoint: `${endpoint}/${agreementId}/`,
    });
  };

  const deleteAgreement = (agreementId) => {
    return client.request({
      endpoint: `${endpoint}/${agreementId}/`,
      method: HttpMethod.DELETE,
    });
  };

  const acceptAgreement = ({ agreementId, ip, userAgent }) => {
    const payload = {
      user_agent: userAgent,
      ip_address: ip,
    };

    return client.request({
      endpoint: `${endpoint}/${agreementId}/accept/`,
      parameters: payload,
      method: HttpMethod.PUT,
    });
  };

  return {
    createAgreement,
    getAgreements,
    getAgreementById,
    deleteAgreement,
    acceptAgreement,
  };
};

export default AgreementsApi;
