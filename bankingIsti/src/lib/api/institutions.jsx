const InstitutionsApi = ({ client }) => {
  const endpoint = "institutions";

  const getInstitutions = async (country) => {
    try {
      const response = await client.request({
        endpoint: `${endpoint}/?country=${country}`,
      });
      return response;
    } catch (error) {
      console.error("Error fetching institutions:", error);
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
