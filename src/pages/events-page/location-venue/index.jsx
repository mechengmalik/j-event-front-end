import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import FormBuilder from '../../../components/form';
import { locationFormFeilds } from './locationConfig';

function LocationVenue() {
  const navigate = useNavigate();

  const { setValue: setFormValue, getValues } = useForm({

    
    
    defaultValues: {
      // Add default values for all form fields here
      location: "",
      locationLat: "",
      locationLng: "",
      // ... other default values
    }
  });
  const [selectedLocation, setSelectedLocation] = useState();
  console.log("🚀 ~ CreateEventForm ~ selectedLocation:", selectedLocation)
  

  // Default form values
 

 const handleFormSubmit = async (data) => {
    try {
      console.log("Form data:", data);

      // Extract values from category and keywords arrays
      const categories = data.category ? data.category.map(item => item.value) : [];
      const keywords = data.keywords ? data.keywords.map(item => item.value) : [];

      // Create formatted event data
      const formatDateTime = (date, time) => {
        // Ensure we have valid Date objects
        const dateObj = date instanceof Date ? date : new Date(date);
        let timeObj = time;

        // If time is a Date object, extract hours and minutes
        if (time instanceof Date) {
          const hours = time.getHours().toString().padStart(2, "0");
          const minutes = time.getMinutes().toString().padStart(2, "0");
          timeObj = `${hours}:${minutes}`;
        }

        // Extract date components
        const year = dateObj.getFullYear();
        const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
        const day = dateObj.getDate().toString().padStart(2, "0");

        // Create ISO-like format
        return `${year}-${month}-${day}T${timeObj}:00`;
      };

      const formattedEvent = {
        ...data,
        startDate: formatDateTime(data.startDate, data.startTime),
        endDate: formatDateTime(data.endDate, data.endTime),
        timeZone: data.timeZone?.value || data.timeZone, // Handle object or string
        category: categories, 
        keywords: keywords,
        locationLat: selectedLocation.lat,
        locationLng: selectedLocation.lng
      };

      console.log("Formatted event data:", formattedEvent);

      // Save to localStorage for demo purposes
      localStorage.setItem("eventFormData", JSON.stringify(formattedEvent));

      // In a real app, you'd send this data to your backend here
      // await api.post('/events', formattedEvent);

      // Navigate back to events list or event details
      // navigate("/events");
    } catch (error) {
      console.error("Failed to create event:", error);
    }
  }

  const handleCancel = () => {
    navigate("/events");
  };

  // const locationType = defaultValues.locationType;

  return (

      <FormBuilder
        formConfig={locationFormFeilds}
        onSubmit={handleFormSubmit}
        onCancel={handleCancel}
        submitButtonText="Create"
        cancelButtonText="Cancel"
        // defaultValues={defaultValues}
        setValue={setFormValue}
        selectedLocation= {selectedLocation}
        setSelectedLocation= {setSelectedLocation}
        hight={"192px"}
        showButton={false}

      />
  );
}

export default LocationVenue