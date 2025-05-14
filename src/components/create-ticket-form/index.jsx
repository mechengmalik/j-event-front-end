import React from "react";
import { useNavigate } from "react-router-dom";
import FormBuilder from "../form";
import { ticketFormFeilds } from "./ticket-form-config";

function CreateTicketForm() {
  const navigate = useNavigate({});

  const handleFormSubmit = async (data) => {
    try {
      // Later: Send `data` to your backend here using fetch or axios
      console.log("Final form data:", data);
      const benefitsArray = data.benefits
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line !== "");
      localStorage.setItem(
        "ticketFormData",
        JSON.stringify({ data:{ ...data, benefits: benefitsArray} })
      );
      navigate(-1)

      // Navigate to events list
      // navigate(`/dashboard/events/${data}`);
    } catch (error) {
      console.error("Failed to create event:", error);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <FormBuilder
      formConfig={ticketFormFeilds}
      onSubmit={handleFormSubmit}
      onCancel={handleCancel}
      submitButtonText="Create"
      cancelButtonText="Cancel"
    />
  );
}

export default CreateTicketForm;
