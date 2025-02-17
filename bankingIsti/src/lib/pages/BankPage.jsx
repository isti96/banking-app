import { setBasePath } from "@shoelace-style/shoelace/dist/utilities/base-path";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import NordigenClient from "../index.js";
import DateTimePicker from "react-datetime-picker";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
import "./BankPage.css";
import { format } from "date-fns";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

setBasePath(
  "https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.13.1/cdn/"
);

const BankPage = () => {
  const navigate = useNavigate();

  const [showIban, setShowIban] = useState(false);
  const [requisition, setRequisition] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [valueFrom, setValueFrom] = useState(new Date());
  const [valueTo, setValueTo] = useState(new Date());
  const [pickerAccountId, setPickerAccountId] = useState(null);

  const client = NordigenClient();

  const { id } = useParams();

  useEffect(() => {
    async function getRequisition() {
      await client.generateToken();
      const requisition = await client.requisition.getRequisitionById(id);
      setRequisition(requisition);

      const accountPromises = requisition.accounts.map(async (accountId) => {
        let account = await client.account(accountId).getDetails();
        account = { ...account, id: accountId };
        return account;
      });
      const accounts = await Promise.all(accountPromises);
      setAccounts(accounts);
    }
    getRequisition();
  }, []);

  const showBalance = async (accountId) => {
    const balance = await client.account(accountId).getBalances();
    let abc = accounts.map((account) =>
      account.id === accountId ? { ...account, balance } : { ...account }
    );
    setAccounts(abc);
  };

  const showTransactions = async (valueFrom, valueTo, accountId) => {
    const transactions = await client
      .account(accountId)
      .getTransactions(
        format(valueFrom, "yyyy-MM-dd"),
        format(valueTo, "yyyy-MM-dd")
      );
    let abc = accounts.map((account) =>
      account.id === accountId ? { ...account, transactions } : { ...account }
    );
    setAccounts(abc);
  };

  return (
    <>
      {accounts.length > 0 ? (
        <div className="container">
          <div className="account-number">
            Nr. of accounts: {accounts.length}
          </div>
          <div className="accounts">
            {accounts.map((account) => (
              <div key={account.id}>
                <div>
                  <Card variant="outlined" className="card">
                    <React.Fragment>
                      <CardContent>
                        <div>
                          Cont in {account.account.currency}{" "}
                          <div className="balanceInfo">
                            <button
                              onClick={() => {
                                showBalance(account.id);
                              }}
                            >
                              Show balance
                            </button>
                            <div className="balanceAmount">
                              {account.balance ? (
                                <span>
                                  {
                                    account.balance.balances[0].balanceAmount
                                      .amount
                                  }{" "}
                                  {
                                    account.balance.balances[0].balanceAmount
                                      .currency
                                  }
                                </span>
                              ) : (
                                ""
                              )}
                            </div>
                          </div>
                          <button
                            className="transactionsButton"
                            onClick={() =>
                              setPickerAccountId(
                                pickerAccountId === account.id
                                  ? null
                                  : account.id
                              )
                            }
                          >
                            Show transactions
                          </button>
                          {pickerAccountId === account.id && (
                            <div className="pickers">
                              <DateTimePicker
                                onChange={async (valueFrom) => {
                                  setValueFrom(valueFrom);
                                  await showTransactions(
                                    valueFrom,
                                    valueTo,
                                    account.id
                                  );
                                }}
                                value={valueFrom}
                                className="picker"
                              />
                              <DateTimePicker
                                onChange={async (valueTo) => {
                                  setValueTo(valueTo);
                                  await showTransactions(
                                    valueFrom,
                                    valueTo,
                                    account.id
                                  );
                                }}
                                value={valueTo}
                                className="picker"
                              />
                            </div>
                          )}
                          {showIban ? (
                            <div>
                              <button onClick={() => setShowIban(!showIban)}>
                                Hide
                              </button>
                              {account.account.iban}
                            </div>
                          ) : (
                            <button onClick={() => setShowIban(!showIban)}>
                              Show IBAN
                            </button>
                          )}
                        </div>
                      </CardContent>
                    </React.Fragment>
                  </Card>
                </div>

                <div>
                  {account.transactions ? (
                    <Card variant="outlined" className="card">
                      <React.Fragment>
                        <CardContent>
                          <div key={account.id}>
                            <span>
                              {account.transactions.transactions.booked.map(
                                (transaction) => {
                                  return (
                                    <div>
                                      {
                                        transaction.remittanceInformationUnstructuredArray
                                      }{" "}
                                      / {transaction.transactionAmount.amount}{" "}
                                      {transaction.transactionAmount.currency}
                                    </div>
                                  );
                                }
                              )}{" "}
                            </span>
                          </div>
                        </CardContent>
                      </React.Fragment>
                    </Card>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
};

export default BankPage;
