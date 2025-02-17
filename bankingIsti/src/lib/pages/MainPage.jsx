import React, { useState, useEffect } from "react";
import "../../App.css";
import "./MainPage.css";
import NordigenClient from "../index.js";
import { setBasePath } from "@shoelace-style/shoelace/dist/utilities/base-path";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import moment from "moment/moment.js";
import { UserContext } from "../api/userContext.jsx";
import { useContext } from "react";

setBasePath(
  "https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.13.1/cdn/"
);

const MainPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(UserContext);

  const [institutions, setInstitutions] = useState([]);
  const [selectedBank, setSelectedBank] = useState("");
  const [selectedBankObject, setSelectedBankObject] = useState({
    id: "",
    name: "",
  });
  const [selectedCountry, setSelectedCountry] = useState({
    code: null,
    name: "Select a country",
  });
  const [bankConnections, setBankConnections] = useState([]);
  const [loading, setLoading] = useState(false);

  const client = NordigenClient();

  const countries = [
    { code: "AT", name: "Austria" },
    { code: "BE", name: "Belgium" },
    { code: "BG", name: "Bulgaria" },
    { code: "RO", name: "Romania" },
  ];
  //   // Fetch bank connections on mount
  useEffect(() => {
    const fetchBankConnections = async () => {
      try {
        await client.generateToken();
        const { data } = await axios.get(
          "http://localhost:8000/getBankConnections",
          {
            params: {
              userId: user._id,
            },
          }
        );

        if (data.length > 0) {
          setBankConnections(data);

          for (const bankConnection of data) {
            const requisition = await client.requisition.getRequisitionById(
              bankConnection.requisitionId
            );

            if (requisition.status === "LN") {
              await axios.post("http://localhost:8000/updateReq", {
                requisitionId: requisition.id,
                status: requisition.status,
                bankId: requisition.institution_id,
                created: requisition.created,
              });
            }
          }
        }
      } catch (error) {
        console.error("Error fetching bank connections:", error);
      }
    };

    fetchBankConnections();
  }, []);

  const handleChangeCountry = async (e) => {
    const selected = countries.find((c) => c.code === e.target.value);
    setSelectedCountry({ code: selected.code, name: selected.name });
    if (selected && selected.code) {
      const institutionsData = await client.institution.getInstitutions(
        selected.code
      );
      setInstitutions(institutionsData);
    }
  };

  const handleChangeBank = (e) => {
    const selected = institutions.find(
      (institution) => institution.id === e.target.value
    );
    setSelectedBank(e.target.value);
    setSelectedBankObject(selected || { id: "", name: "" });
  };

  const getConnection = async () => {
    if (!selectedBank) return;

    const agreement = await client.agreement.createAgreement({
      institutionId: selectedBank,
    });

    const requisition = await client.requisition.createRequisition({
      redirectUrl: "http://localhost:5173",
      institutionId: selectedBank,
      agreement: agreement.id,
    });

    await axios.post("http://localhost:8000/reqid", {
      bankId: selectedBank,
      bankName: selectedBankObject.name,
      requisitionId: requisition.id,
      status: requisition.status,
      created: requisition.created,
      userId: user._id,
    });

    window.open(requisition.link, "_self");
  };

  const deleteConnection = async (id) => {
    await axios.post("http://localhost:8000/deleteConnection", {
      requisitionId: id,
    });
    setBankConnections((prev) =>
      prev.filter((conn) => conn.requisitionId !== id)
    );
  };

  return (
    <>
      <div className="mb-5">
        <p className="mr-5">Active connections for {user.displayName}:</p>
        {loading
          ? "Loading..."
          : bankConnections.map(
              (connection) =>
                connection.status === "LN" && (
                  <div className="connections" key={connection.bankId}>
                    <button
                      className="connection"
                      onClick={() =>
                        navigate(`/bank/${connection.requisitionId}`)
                      }
                    >
                      {connection.bankName}
                    </button>
                    <p className="connection">
                      - connected on:{" "}
                      {moment(connection.created).format("DD/MM/YYYY - HH:mm")}
                    </p>
                    <button
                      onClick={() => deleteConnection(connection.requisitionId)}
                    >
                      Delete
                    </button>
                  </div>
                )
            )}
      </div>

      <div className="flex flex-row mb-5">
        <p className="mr-5">Select country:</p>
        <select
          value={selectedCountry.code || ""}
          onChange={handleChangeCountry}
        >
          <option value="">Select a country</option>
          {countries.map((country) => (
            <option value={country.code} key={country.code}>
              {country.name}
            </option>
          ))}
        </select>
      </div>

      {selectedCountry.code && (
        <div className="flex flex-row">
          <p className="mr-5">Select a bank: </p>
          <select
            className="w-80"
            value={selectedBankObject.id}
            onChange={handleChangeBank}
          >
            <option value="">Select a bank</option>
            {institutions.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <button className="m-5" disabled={!selectedBank} onClick={getConnection}>
        Connect to Bank
      </button>

      <div id="chartContainer"></div>
      <button onClick={() => navigate("/login")}>Log out</button>
    </>
  );
};

export default MainPage;
