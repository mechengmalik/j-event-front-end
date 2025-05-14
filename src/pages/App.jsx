import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./home";
// import About from "./about";
import SignIn from "./sign-in";
import SignUp from "./sign-up";
import Dashboard from "./dashboard";
import Events from "./dashboard/events";
import CreateEvent from "./dashboard/create-event";
import EventDetails from "./dashboard/events/event-details";
import SeatingMapBuilder from "../components/seating-chart";
import EventTickets from "./dashboard/event-ticket";
import CreateTicket from "./dashboard/event-ticket/create-ticket";
// import EventSeatMap from "./dashboard/event-seat-map";
import "../pages/App.css";
import CreateEventForm from "../components/create-event-form";
import EventLandingPage from "./dashboard/events/event-landing-page";

function App() {
  return (
    <div className="body-container">
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/about" element={<About />} /> */}
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        {/* <Route path="/event/:eventId" element={<EventLandingPage />} /> */}
        <Route path="/event/landing-page" element={<EventLandingPage />} />

        {/* Nested Dashboard Routes */}
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<Events />} />
          <Route path="events" element={<Events />} />
          <Route path="create-event" element={<CreateEventForm />} />
          <Route path="events/:eventId" element={<EventDetails />} />
          {/* Add nested route for tickets under event ID */}
          <Route path="events/:eventId/tickets" element={<EventTickets />} />
          <Route
            path="events/:eventId/tickets/create"
            element={<CreateTicket />}
          />

          {/* <Route path="events/:eventId/edit" element={<EditEvent />} /> */}
          <Route path="events/seating-map" element={<SeatingMapBuilder />} />
        </Route>
        {/* <Route path="*" element={<Navigate to="/" />} /> */}
      </Routes>
    </div>
  );
}

export default App;
