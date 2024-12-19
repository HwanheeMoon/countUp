import React from "react";
import "./App.css";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router";
import { BottomNav } from "./components/BottomNav.tsx";
import { MainPage } from "./pages/mainPage.tsx";
import { DownloadPage } from "./pages/downloadPage.tsx";

const App = () => {
   const ignores = ["/download"];

   return (
      <div className="App">
         <BrowserRouter>
            <Routes>
               <Route path="/" element={<MainPage />} />
               <Route path="/download" element={<DownloadPage />} />
            </Routes>
         </BrowserRouter>
         {!ignores.includes(window.location.pathname) && <BottomNav />}
      </div>
   );
};

export default App;
