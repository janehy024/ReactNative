import React from "react";
import InitScreen from "./screens/InitScreen";
import { ThemeProvider } from "./hooks/useTheme";
import { LocationProvider } from "./hooks/useLocation";
import HomeScreen from "./screens/HomeScreen";

function App() {
  return(
    <ThemeProvider>
      <LocationProvider>
        <InitScreen/> 
      </LocationProvider>
    </ThemeProvider>
  );
};

export default App;
