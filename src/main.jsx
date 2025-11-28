import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import router from "./routes/router.jsx";
import { RouterProvider } from "react-router-dom";
import { ProfileProvider } from "./context/ProfileContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ProfileProvider>
      <RouterProvider router={router} />
    </ProfileProvider>
  </StrictMode>
);
