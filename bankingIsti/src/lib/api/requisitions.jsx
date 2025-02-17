import { HttpMethod } from "../httpMethod.js";

const RequisitionsApi = ({ client }) => {
  const endpoint = "requisitions";

  const createRequisition = ({
    redirectUrl,
    institutionId,
    agreement,
    userLanguage,
    redirectImmediate = false,
    accountSelection = false,
    reference = null,
    ssn = null,
  }) => {
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

    return client.request({
      endpoint: `${endpoint}/`,
      parameters: payload,
      method: HttpMethod.POST,
    });
  };

  const getRequisitions = ({ limit = 100, offset = 0 } = {}) => {
    const params = { limit, offset };
    return client.request({
      endpoint: `${endpoint}/`,
      method: HttpMethod.GET,
      parameters: params,
    });
  };

  const getRequisitionById = (requisitionId) => {
    return client.request({
      endpoint: `${endpoint}/${requisitionId}/`,
    });
  };

  const deleteRequisition = (requisitionId) => {
    return client.request({
      endpoint: `${endpoint}/${requisitionId}/`,
      method: HttpMethod.DELETE,
    });
  };

  return {
    createRequisition,
    getRequisitions,
    getRequisitionById,
    deleteRequisition,
  };
};

export default RequisitionsApi;
