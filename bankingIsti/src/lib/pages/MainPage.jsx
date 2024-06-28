import React from "react";
import "../../App.css";
import NordigenClient from "../index.js";
import { setBasePath } from "@shoelace-style/shoelace/dist/utilities/base-path";
import axios from "axios";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CanvasJS from "@canvasjs/charts";
import { withRouter } from "../withRouter";

setBasePath(
  "https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.13.1/cdn/"
);

class MainPage extends React.Component {
  constructor(props) {
    super(props);
    this.goToRoute = this.goToRoute.bind(this);

    this.state = {
      institutions: [],
      selectedBank: "",
      selectedCountry: { code: null, name: "Select a country" },
      bankConnections: [],
      accounts: [],
      items: {},
      balances: [],
      transactions: [],
      showBalance: false,
      showTransactions: false,
      selectedAccount: "",
      listOfTotalAmounts: [],
      chartData: [],
      chart: [],
      activeConnections: [],
    };
    this.showBalanceMethod = this.showBalanceMethod.bind(this);

    this.client = new NordigenClient({
      secretId: "0bdfe1c7-25c6-4433-a685-57a58f01f52e",
      secretkey:
        "3a43e9946adf064310d0bb5cd6ff91907d792b7c04e1076ec2222bd68a7058d989ae8495e5c5f11086001b0c0af19434d0979c5fa2afd7ecc7c815836b76ce9b",
    });

    this.countries = [
      { code: "AT", name: "Austria" },
      { code: "BE", name: "Belgium" },
      { code: "BG", name: "Bulgaria" },
      { code: "RO", name: "Romania" },
    ];
  }

  goToRoute(route) {
    this.props.navigate(route);
  }

  async componentDidMount() {
    await this.client.generateToken();
    await axios.get("http://localhost:8000/getBankConnections").then((res) => {
      if (res.data.length > 0) {
        this.setState({ bankConnections: res.data }, async () => {
          let accountsList = [];
          this.state.bankConnections.forEach(async (bankConnection) => {
            const requisition =
              await this.client.requisition.getRequisitionById(
                bankConnection.requisitionId
              );
            console.log(requisition);
            if (requisition.status == "LN") {
              axios
                .post("http://localhost:8000/updateReq", {
                  requisitionId: requisition.id,
                  status: requisition.status,
                  bankId: requisition.institution_id,
                  created: requisition.created,
                })
                .catch((err) => console.log(err));

              accountsList.push({
                bankName: requisition.institution_id,
                accounts: requisition.accounts,
              });
            }

            this.setState({ accounts: accountsList });
          });
        });
      }
    });
  }

  renderBalance() {
    if (this.state.showBalance) {
      return this.state.balances.map((balance) => {
        return (
          <div>
            {balance.bankName}
            {this.seeBalance(balance.amounts)}
          </div>
        );
      });
    }
  }

  handleSelectAccount(e) {
    this.setState({ selectedAccount: e });
  }

  seeBalance(amounts) {
    return (
      <div>
        {amounts.map((amount) => {
          return (
            <div>
              <div>
                <Card variant="outlined">
                  {" "}
                  <React.Fragment>
                    <CardContent>
                      {amount.amount} {amount.currency}{" "}
                      <button
                        onClick={async () => {
                          await this.getTransactions(amount.accountId);
                          this.handleSelectAccount(amount.accountId);
                        }}
                      >
                        see transactions
                      </button>
                      {this.state.transactions.map((transaction) => {
                        if (this.state.selectedAccount == amount.accountId)
                          return (
                            <div>
                              {transaction.creditorName} -{" "}
                              {transaction.transactionAmount.amount}{" "}
                              {transaction.transactionAmount.currency}
                            </div>
                          );
                      })}
                    </CardContent>
                  </React.Fragment>
                </Card>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  showBalanceMethod() {
    this.setState({ showBalance: true });
  }

  renderTransactions() {
    if (this.state.showTransactions) {
      return;
    }
  }

  async getInstitutions(country) {
    const institutions = await this.client.institution.getInstitutions(country);
    this.setState({ institutions: institutions });
  }

  handleChangeCountry(e) {
    this.setState({ selectedCountry: e.target.value }, async () => {
      this.setState({ selectedBank: "" });
      if (this.state.selectedCountry != "Select a country") {
        await this.getInstitutions(this.state.selectedCountry);
      } else {
        this.setState({ institutions: [] });
      }
    });
  }

  handleChangeBank(e) {
    this.setState({ selectedBank: e.target.value });
  }

  async getConnection() {
    const agreement = await this.client.agreement.createAgreement({
      institutionId: this.state.selectedBank,
    });

    const requisition = await this.client.requisition.createRequisition({
      redirectUrl: "http://localhost:5173",
      institutionId: this.state.selectedBank,
      agreement: agreement.id,
    });

    this.setState({ requisitionId: requisition.id }, async () => {
      axios.post(`http://localhost:8000/reqid`, {
        bankId: this.state.selectedBank,
        requisitionId: requisition.id,
        status: requisition.status,
        created: requisition.created,
      });
    });
    window.open(requisition.link, "_blank");
  }

  async getChartData() {
    let listOfTotalAmounts = [];
    this.state.balances.map((x) =>
      x.amounts.map((x) => {
        if (x.currency == "RON") listOfTotalAmounts.push(x.amount);
      })
    );
    let chartdata = [];
    await this.setState(
      {
        listOfTotalAmounts: listOfTotalAmounts,
      },
      () => {
        chartdata = this.state.listOfTotalAmounts.map((x) => {
          return {
            y: Number(x),
            label: "RON",
          };
        });
      }
    );
    await this.setState({ chartData: chartdata });

    this.setState(
      {
        chart: new CanvasJS.Chart("chartContainer", {
          animationEnabled: true,
          zoomEnabled: true,
          theme: "dark2",
          title: {
            text: "Money management",
          },
          axisX: {
            title: "Currency",
            valueFormatString: "####",
            interval: 1,
          },
          axisY: {
            logarithmic: true,
            logarithmBase: 5,
            title: "Amount of money logarithmic",
            titleFontColor: "#6D78AD",
            lineColor: "#6D78AD",
            gridThickness: 0,
            lineThickness: 1,
          },
          axisY2: {
            title: "Amount of money linear",
            titleFontColor: "#51CDA0",
            logarithmic: false,
            lineColor: "#51CDA0",
            gridThickness: 0,
            lineThickness: 1,
          },
          legend: {
            verticalAlign: "top",
            fontSize: 16,
            dockInsidePlotArea: true,
          },
          data: [
            {
              type: "stackedColumn",
              xValueFormatString: "####",
              showInLegend: true,
              name: "BT",
              dataPoints: [this.state.chartData[0]],
            },
            {
              type: "stackedColumn",
              xValueFormatString: "####",
              showInLegend: true,
              name: "REVOLUT",
              dataPoints: [this.state.chartData[1]],
            },
          ],
        }),
      },
      () => {
        this.state.chart.render();
      }
    );
  }

  async fetchAccounts() {
    let balancesList = [];

    this.state.accounts.forEach(async (bankAccount) => {
      let amounts = [];
      bankAccount.accounts.forEach(async (account) => {
        const accountDetails = this.client.account(account);
        const balance = await accountDetails.getBalances();
        amounts.push({
          accountId: account,
          amount: balance.balances[0].balanceAmount.amount,
          currency: balance.balances[0].balanceAmount.currency,
        });
      });
      balancesList.push({
        bankName: bankAccount.bankName,
        amounts: amounts,
      });
    });
    this.setState({ balances: balancesList });
  }

  async getTransactions(accountId) {
    const accountDetails = this.client.account(accountId);
    const transactions = await accountDetails.getTransactions(
      "2024-01-02",
      "2024-03-13",
      ""
    );
    this.setState({ transactions: transactions.transactions.booked });
  }

  renderInstitutions() {
    if (this.state.selectedCountry != "Select a country") {
      return this.state.institutions.map((item) => {
        return (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        );
      });
    }
  }

  renderBankSelecting() {
    if (
      this.state.selectedCountry.name != "Select a country" &&
      this.state.selectedCountry != "Select a country"
    ) {
      return (
        <div className="flex flex-row">
          <p className="mr-5">Select a bank: </p>
          <select
            className="w-80"
            defaultValue={this.state.selectedBank}
            onChange={(e) => this.handleChangeBank(e)}
          >
            <option value={""}>Select a bank</option>
            {this.renderInstitutions()}
          </select>
        </div>
      );
    } else {
      return <div></div>;
    }
  }

  renderActiveConnections() {
    if (this.state.bankConnections.length > 0) {
      return this.state.bankConnections.map((connection) => {
        if (connection.status == "LN") {
          return <p>{connection.bankId}</p>;
        }
      });
    }
  }

  render() {
    return (
      <>
        <div className=" mb-5">
          <p className="mr-5">Your active connections:</p>
          {this.renderActiveConnections()}
        </div>

        <div className="flex flex-row mb-5">
          <p className="mr-5">Select country:</p>
          <select
            value={this.state.selectedCountry}
            onChange={(e) => this.handleChangeCountry(e)}
          >
            <option value={null}>Select a country</option>
            {this.countries.map((country) => {
              return <option value={country.code}>{country.name}</option>;
            })}
          </select>
        </div>
        {this.renderBankSelecting()}
        <button
          className="m-5"
          disabled={
            this.state.selectedCountry.name == "Select a country" ||
            this.state.selectedBank == ""
          }
          onClick={() => {
            this.getConnection();
          }}
        >
          Connect to Bank
        </button>
        <div></div>
        <button onClick={this.showBalanceMethod}>
          Render account balances
        </button>
        <button
          onClick={() => {
            this.fetchAccounts();
          }}
        >
          Fetch account balances
        </button>
        {this.renderBalance()}
        <button
          onClick={() => {
            this.getChartData();
          }}
        >
          get chart
        </button>
        <div id="chartContainer"></div>
        <button onClick={() => this.goToRoute("/login")}>Log out</button>
      </>
    );
  }
}

export default withRouter(MainPage);
