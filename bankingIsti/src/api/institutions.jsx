import React, { useState, useEffect } from "react";
import NordigenClient from "../index.js";

const InstitutionApi = ({ client }) => {
  const endpoint = "institutions";
  const [institutions, setInstitutions] = useState([]);

  useEffect(() => {
    const fetchData = async (country) => {
      try {
        const response = await client.request({
          endpoint: `${endpoint}/?country=${country}`,
        });
        setInstitutions(response);
      } catch (error) {
        console.error("Error fetching institutions:", error);
      }
    };

    fetchData("defaultCountry");
  }, [client, endpoint]);

  const getInstitutionById = async (id) => {
    try {
      const response = await client.request({
        endpoint: `${endpoint}/${id}/`,
      });
      return response;
    } catch (error) {
      console.error(`Error fetching institution with id ${id}:`, error);
    }
  };

  return {
    institutions,
    getInstitutionById,
  };
};

export default InstitutionApi;
