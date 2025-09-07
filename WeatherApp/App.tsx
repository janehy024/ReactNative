import React from "react";
import InitScreen from "./screens/InitScreen";
import { ThemeProvider } from "./hooks/useTheme";
import { LocationProvider } from "./hooks/useLocation";
import { WeatherPrvider } from "./hooks/useWeather";
import HomeScreen from "./screens/HomeScreen";

function App() {
  return(
    <ThemeProvider>
      <LocationProvider>
        <WeatherPrvider>
          <InitScreen/> 
        </WeatherPrvider>
      </LocationProvider>
    </ThemeProvider>
  );
};

export default App;
