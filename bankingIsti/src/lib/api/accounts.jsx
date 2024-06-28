import React from "react";

class AccountApi extends React.Component {
  constructor({ client, accountId }) {
    super();
    this.endpoint = "accounts";
    this.client = client;
    this.accountId = accountId;
  }

  get(path, parameters = {}) {
    const url = `${this.endpoint}/${this.accountId}/${path}`;
    return this.client.request({ endpoint: url, parameters });
  }

  getMetadata() {
    return this.client.request({
      endpoint: `${this.endpoint}/${this.accountId}`,
    });
  }

  getDetails() {
    return this.get("details");
  }

  getBalances() {
    return this.get("balances");
  }

  getTransactions(dateFrom, dateTo, country = "") {
    const params = {
      date_from: dateFrom,
      date_to: dateTo,
      country: country,
    };
    return this.get("transactions", params);
  }

  render() {
    return null; // Or you can return any UI component if needed
  }
}

export default AccountApi;
