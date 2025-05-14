const ticketTypes = [
  { value: "general", label: "General" },
  { value: "vip", label: "VIP" },
  { value: "early-bird", label: "Early Bird" }
];

const currencies = [
  { value: "usd", label: "USD" },
  { value: "eur", label: "EUR" },
  { value: "gbp", label: "GBP" }
];

export const ticketFormFeilds = {
    fields: [
      {
        type: "text",
        name: "ticketName",
        label: "Ticket Name (Visible For Organizer)",
        placeholder: "Type a custom name for ticket...",
        required: true,
        errorMessage: "Ticket name is required"
      },
      {
        type: "select",
        name: "ticketType",
        label: "Ticket Type",
        placeholder: "Select type",
        options: ticketTypes,
        required: true,
        errorMessage: "Ticket type is required"
      },
      {
        layout: "row",
        name: "pricingRow",
        width: "full",
        fields: [
          {
            type: "select",
            name: "currency",
            label: "Currency",
            placeholder: "Select currency",
            options: currencies,
            required: true,
            errorMessage: "Currency is required",
            width: "1/2"
          },
          {
            type: "number",
            name: "price",
            label: "Price",
            placeholder: "Type number",
            required: true,
            errorMessage: "Price is required",
            width: "1/2"
          }
        ]
      },
      {
        type: "number",
        name: "quantity",
        label: "Quantity",
        placeholder: "Type number",
        required: true,
        errorMessage: "Quantity is required"
      },
      {
        id:"benefitsTextArea",
        type: "textarea",
        name: "benefits",
        label: "Benefits (one per line)",
        placeholder: "Ticket benefits",
        required: false,
        rows: 4
      }
    ]
  };