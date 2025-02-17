const AccountsApi = ({ client, accountId }) => {
  const endpoint = "accounts";

  const get = (path, parameters = {}) => {
    const url = `${endpoint}/${accountId}/${path}`;
    return client.request({ endpoint: url, parameters });
  };

  const getMetadata = () => {
    return client.request({
      endpoint: `${endpoint}/${accountId}`,
    });
  };

  const getDetails = () => get("details");

  const getBalances = () => get("balances");

  const getTransactions = (dateFrom, dateTo, country = "") => {
    const params = {
      date_from: dateFrom,
      date_to: dateTo,
      country: country,
    };
    return get("transactions", params);
  };

  return {
    get,
    getMetadata,
    getDetails,
    getBalances,
    getTransactions,
  };
};

export default AccountsApi;
