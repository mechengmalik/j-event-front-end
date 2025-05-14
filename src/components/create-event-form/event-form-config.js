// Updated event-form-config.js

const locationTypes = [
  {
    value: "in-person",
    title: "In-person",
    description:
      "Conduct an event in a physical venue for face-to-face networking.",
  },
  {
    value: "virtual",
    title: "Virtual",
    description:
      "Host a digital event that engages participants who join remotely.",
  },
  {
    value: "hybrid",
    title: "Hybrid",
    description: "Expand your in-person event to reach a wider audience.",
  },
];

const categories = [
  { value: "conference", label: "Conference" },
  { value: "workshop", label: "Workshop" },
  { value: "meetup", label: "Meetup" },
];

// Create timezone options for the select dropdown
const getTimezoneOptions = () => {
  const timeZones = Intl.supportedValuesOf('timeZone');
  return timeZones.map(tz => {
    // Create a more user-friendly label that includes the GMT offset
    const now = new Date();
    const tzOffset = new Intl.DateTimeFormat('en', {
      timeZone: tz,
      timeZoneName: 'short'
    }).formatToParts(now).find(part => part.type === 'timeZoneName')?.value || '';
    
    return {
      value: tz,
      label: `${tz} (${tzOffset})`
    };
  });
};

export const eventFormFeilds = {
  fields: [
    {
      type: "text",
      name: "eventName",
      label: "Event Name",
      placeholder: "Type the event name...",
      required: true,
      errorMessage: "Event name is required",
    },
    {
      type: "textarea",
      name: "description",
      label: "Description",
      placeholder: "Type the event description",
      required: true,
      errorMessage: "Description is required",
    },
    {
      type: "radio-group",
      name: "locationType",
      label: "Event Location Type",
      options: locationTypes,
      required: true,
      errorMessage: "Event location type is required",
    },
    {
      type: "select",
      name: "category",
      label: "Category",
      placeholder: "Select Category",
      options: categories,
      isMulti: true,
      required: true,
      errorMessage: "Select at least one Category",
      allowCustomOption: false,
    },
    {
      type: "select",
      name: "keywords",
      label: "Keywords",
      placeholder: "Choose Keywords",
      options: categories, // Using same options for demo, you can change this
      isMulti: true,
      isSearchable: true,
      required: true,
      errorMessage: "Select at least one keyword",
      allowCustomOption: true,
    },
    {
      layout: "row",
      name: "dates",
      fields: [
        {
          type: "date",
          name: "startDate",
          label: "Start Date",
          placeholder: "Select start date",
          required: true,
          errorMessage: "Start date is required",
        },
        {
          type: "date",
          name: "endDate",
          label: "End Date",
          placeholder: "Select end date",
          required: true,
          errorMessage: "End date is required",
          minDateField: "startDate",
        },
      ],
    },
    {
      layout: "row",
      name: "timeSettings",
      fields: [
        {
          type: "select",
          name: "timeZone",
          label: "Time zone",
          placeholder: "e.g: Riyadh (GMT +3)",
          options: getTimezoneOptions(),
          isMulti: false,
          isSearchable: true,
          required: true,
          errorMessage: "Time zone is required",
          width: "1/3", // Use 1/3 of the row width
        },
        {
          type: "time",
          name: "startTime",
          label: "Start Time",
          placeholder: "18:00",
          required: true,
          errorMessage: "Start time is required",
          width: "1/3", // Use 1/3 of the row width
        },
        {
          type: "time",
          name: "endTime",
          label: "End Time",
          placeholder: "23:59",
          required: true,
          errorMessage: "End time is required",
          width: "1/3", // Use 1/3 of the row width
        },
      ],
    },
    {
      type: "file",
      name: "banner",
      label: "Event Banner",
      required: true,
      errorMessage: "Event banner is required",
    },
    {
      type: "url",
      name: "eventLink",
      label: "Event Link",
      placeholder: "Type the event link...",
      required: true,
      errorMessage: "Event link is required",
      conditional: {
        field: "locationType",
        value: ["virtual", "hybrid"],
      },
    },
    {
      name: "location",
      type: "custom-location",
      label: "Location",
      required: true,
      errorMessage: "Location is required",
      conditional: {
        field: "locationType",
        value: ["in-person", "hybrid"]
      }
    },    {
      name: "location",
      type: "hidden", 
    },
    {
      name: "locationLat",
      type: "hidden", 
    },
    {
      name: "locationLng",
      type: "hidden", 
    },

  ],
};