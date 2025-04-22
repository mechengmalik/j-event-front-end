import { Routes, Route } from 'react-router-dom';
import Home from './home/index';
import About from './about/index';
import Dashboard from './dashboard';
import Events from './dashboard/events/index';
import SignIn from './sign-in/index';
import '../pages/App.css'
import SignUp from './sign-up';
import CreateEvent from './dashboard/create-event';

function App() {
  return (
    <div className='body-container'>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/about" element={<About />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-event" element={<CreateEvent />} />
        <Route path="/events" element={<Events />} />


      </Routes>
    </div>
  );
}

export default App
