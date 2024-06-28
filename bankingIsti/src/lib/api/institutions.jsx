import React from "react";

class InstitutionApi extends React.Component {
  constructor(props) {
    super(props);
    this.endpoint = "institutions";
    this.state = {
      institutions: [],
    };
    this.client = props.client;
  }

  getInstitutions = async (country) => {
    try {
      const response = await this.client.request({
        endpoint: `${this.endpoint}/?country=${country}`,
      });
      this.setState({ institutions: response });
      return response;
    } catch (error) {
      console.error("Error fetching institutions:", error);
    }
  };

  getInstitutionById = async (id) => {
    try {
      const response = await this.client.request({
        endpoint: `${this.endpoint}/${id}/`,
      });
      return response;
    } catch (error) {
      console.error(`Error fetching institution with id ${id}:`, error);
    }
  };

  render() {
    const { institutions } = this.state;
    return (
      <div>
        {/* You can render institutions or manipulate the state as needed */}
      </div>
    );
  }
}

export default InstitutionApi;
