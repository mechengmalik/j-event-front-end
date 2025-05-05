import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./home";
// import About from "./about";
import SignIn from "./sign-in";
import SignUp from "./sign-up";
import Dashboard from "./dashboard";
import Events from "./dashboard/events";
import CreateEvent from "./dashboard/create-event";
import "../pages/App.css";
import EventDetails from "./dashboard/events/event-details";
// import EventSeatMap from "./dashboard/event-seat-map";
import SeatingMapBuilder from "../components/seating-chart";

function App() {
  return (
    <div className="body-container">
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/about" element={<About />} /> */}
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />

        {/* Nested Dashboard Routes */}
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<Events />} />
          <Route path="events" element={<Events />} />
          <Route path="create-event" element={<CreateEvent />} />
          <Route path="events/:eventId" element={<EventDetails />} />
          {/* <Route path="events/:eventId/edit" element={<EditEvent />} /> */}
          {/* <Route path="events/seating-map" element={<EventSeatMap />} /> */}

        </Route>
        <Route path="dashboard/events/seating-map" element={<SeatingMapBuilder />} />



        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;
