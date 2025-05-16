import { useState, useEffect, useMemo, useCallback } from "react";
import CommonDatePicker from "../form/inputs/date-picker";
import { twMerge } from "tailwind-merge";
import RadioCardGroup from "../form/inputs/radio-group";

// EventFilter component that receives events data and returns filtered events
export default function EventFilter({
  events = [],
  onFilterChange = () => {},
}) {
  // Categories state
  const [selectedCategories, setSelectedCategories] = useState({
    Fashion: false,
    "Family & Education": false,
    Business: false,
    Health: false,
    "Food & Drink": false,
  });

  // Date filter state
  const [dateFilter, setDateFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState(null);

  // Price filter state
  const [priceFilter, setPriceFilter] = useState("all");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(500);

  // Memoize the filter function to prevent unnecessary re-renders
  const getFilteredEvents = useCallback(() => {
    if (!events || !Array.isArray(events) || events.length === 0) {
      return [];
    }

    return events.filter((event) => {
      // Filter by category (if any selected)
      const categorySelected = Object.values(selectedCategories).some(
        (value) => value
      );
      const passesCategory =
        !categorySelected ||
        (event.categories &&
          event.categories.some((category) => selectedCategories[category]));

      // Filter by date
      let passesDate = true;
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const fridayThisWeek = new Date(today);
      fridayThisWeek.setDate(today.getDate() + ((5 - today.getDay() + 7) % 7));

      const saturdayThisWeek = new Date(fridayThisWeek);
      saturdayThisWeek.setDate(fridayThisWeek.getDate() + 1);

      const sundayThisWeek = new Date(fridayThisWeek);
      sundayThisWeek.setDate(fridayThisWeek.getDate() + 2);

      if (dateFilter === "today") {
        const eventDate = new Date(event.date);
        eventDate.setHours(0, 0, 0, 0);
        passesDate = eventDate.getTime() === today.getTime();
      } else if (dateFilter === "tomorrow") {
        const eventDate = new Date(event.date);
        eventDate.setHours(0, 0, 0, 0);
        passesDate = eventDate.getTime() === tomorrow.getTime();
      } else if (dateFilter === "weekend") {
        const eventDate = new Date(event.date);
        eventDate.setHours(0, 0, 0, 0);
        passesDate =
          eventDate.getTime() === fridayThisWeek.getTime() ||
          eventDate.getTime() === saturdayThisWeek.getTime() ||
          eventDate.getTime() === sundayThisWeek.getTime();
      } else if (dateFilter === "specific" && selectedDate) {
        try {
          // Now both are in YYYY-MM-DD format, we can do a direct string comparison
          // assuming event.date is already in YYYY-MM-DD format
          passesDate = event.date === selectedDate;

          // For debugging
          // console.log('Event date:', event.date);
          // console.log('Selected date:', selectedDate);
          // console.log('Match:', passesDate);
        } catch (error) {
          console.error("Error comparing dates:", error);
          passesDate = false;
        }
      }

      // Filter by price
      let passesPrice = true;
      if (priceFilter === "free") {
        passesPrice = parseFloat(event.price) === 0 || event.isFree === true;
      } else if (priceFilter === "paid") {
        const eventPrice = parseFloat(event.price);
        passesPrice =
          eventPrice > 0 && eventPrice >= minPrice && eventPrice <= maxPrice;
      }

      return passesCategory && passesDate && passesPrice;
    });
  }, [
    events,
    selectedCategories,
    dateFilter,
    selectedDate,
    priceFilter,
    minPrice,
    maxPrice,
  ]);

  // Use useMemo to memoize the filtered events
  const filteredEvents = useMemo(() => {
    return getFilteredEvents();
  }, [getFilteredEvents]);

  // Effect to call onFilterChange only when filtered events change
  useEffect(() => {
    onFilterChange(filteredEvents);
  }, [filteredEvents, onFilterChange]);

  // Handle category changes
  const handleCategoryChange = useCallback((category) => {
    setSelectedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  }, []);

  // Handle date filter changes
  const handleDateFilterChange = useCallback((filter) => {
    setDateFilter(filter);
    // Reset selected date when changing away from specific date
    if (filter !== "specific") {
      setSelectedDate(null);
      handleDatePickerChange(filter);
    }
  }, []);

  // Handle date selection from date picker
  const handleDatePickerChange = useCallback((event) => {
    // Handle the date object properly from CommonDatePicker
    if (event && event.target && event.target.value) {
      // Get the date object
      const date = new Date(event.target.value);

      // Format the date as YYYY-MM-DD to match event.date format
      const year = date.getFullYear();
      // Month is 0-indexed, so add 1 and ensure two digits
      const month = String(date.getMonth() + 1).padStart(2, "0");
      // Ensure two digits for day
      const day = String(date.getDate()).padStart(2, "0");

      // Create formatted date string: YYYY-MM-DD
      const formattedDate = `${year}-${month}-${day}`;

      // Store the formatted date string
      setSelectedDate(formattedDate);

      // Ensure the date filter is set to 'specific'
      setDateFilter("specific");

      console.log("Formatted selected date:", formattedDate);
    }
  }, []);

  // Handle price filter changes
  const handlePriceFilterChange = useCallback((filter) => {
    setPriceFilter(filter);
  }, []);
  const dateOptions = [
    {
      value: "all",
      title: "all",
    },
    {
      value: "today",
      title: "today",
    },
    {
      value: "tomorrow",
      title: "tomorrow",
    },
    {
      value: "weekend",
      title: "weekend",
    },
    {
      value: "specific",
      title: "specific",
    },
  ];
  const priceOptions = [
    {
      value: "all",
      title: "all",
    },
    {
      value: "free",
      title: "free",
    },
    {
      value: "paid",
      title: "paid",
    },
  ];

  return (
    <div className="bg-white text-left">
      <p className="text-xl font-bold pb-2">Filters</p>
      <div className="border border-black/20 rounded-lg p-4">
        {/* Categories Section */}
        <div className="">
          <h3 className="text-base text-[#8354A3] font-medium py-2">
            Categories
          </h3>
          <div className="flex flex-col justify-between">
            {Object.keys(selectedCategories).map((category) => (
              <label
                key={category}
                className="flex items-center text-normal text-base space-x-2 py-2"
              >
                <input
                  type="checkbox"
                  checked={selectedCategories[category]}
                  onChange={() => handleCategoryChange(category)}
                  className="h-4 w-4 text-[#8354A3] accent-[#8354A3]"
                />
                <span>{category}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Date Section */}
        <div className="flex flex-col justify-between">
          {/* <h3 className="text-base text-[] font-semibold py-2">Date</h3> */}

          <div className=" flex flex-col font-normal">
            <RadioCardGroup
              label={"Date"}
              options={dateOptions}
              value={dateFilter}
              onChange={(e) => handleDateFilterChange(e)}
              row={false}
            />
          </div>
          {dateFilter === "specific" && (
            <CommonDatePicker
              label="Pick a date"
              value={selectedDate}
              onChange={handleDatePickerChange}
              placeholder="Choose a date"
              id="specific-date-picker"
              minDate={null}
            />
          )}
        </div>

        {/* Price Section */}
        <div>
          {/* <h3 className="text-base text-[] font-semibold py-2">Price</h3> */}
          <div className="">
            <div className=" flex flex-col font-normal">
              <RadioCardGroup
                label={"Price"}
                options={priceOptions}
                value={priceFilter}
                onChange={(e) => handlePriceFilterChange(e)}
                row={false}
              />
            </div>

            {/* Show price range inputs when "Paid" is selected */}
            {priceFilter === "paid" && (
              <div className="pt-4 space-y-3">
                <div className="flex space-x-4 items-center">
                  <div>
                    <label className="block text-sm text-gray-600">Min</label>
                    <div className="flex items-center border border-black/20 rounded overflow-hidden">
                      <input
                        type="number"
                        value={minPrice}
                        onChange={(e) => setMinPrice(Number(e.target.value))}
                        min="0"
                        className="p-1 w-15 text-center"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600">Max</label>
                    <div className="flex items-center border border-black/20 rounded overflow-hidden">
                      <input
                        type="number"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(Number(e.target.value))}
                        min={minPrice}
                        className="p-1 w-20 text-center"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
