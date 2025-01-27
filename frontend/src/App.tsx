import React from "react";
import CalendarWithEvents from "./CalendarWithEvents";

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <CalendarWithEvents />
    </div>
  );
};

export default App;