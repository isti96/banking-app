const InstitutionsApi = ({ client }) => {
  const endpoint = "institutions";

  const getInstitutions = async (country) => {
    try {
      const response = await client.request({
        endpoint: "gocardless/country",
        parameters: country,
      });
      if (!response.ok) {
        const errorData = await response.json(); // Parse the error response
        console.error("Error Response:", errorData);
        return;
      }
      return response;
    } catch (error) {
      console.error("Error fetching institutions:", error);
      console.log(error);
    }
  };

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

  return { getInstitutions, getInstitutionById };
};

export default InstitutionsApi;
