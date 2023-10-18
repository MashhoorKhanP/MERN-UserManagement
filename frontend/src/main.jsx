import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import store from "./store";
import { Provider } from "react-redux";
import App from "./App.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import PrivateRoute from "./components/PrivateRoute";
import HomeScreen from "./screens/HomeScreen.jsx";
import LoginScreen from "./screens/LoginScreen.jsx";
import RegisterScreen from "./screens/RegisterScreen.jsx";
import ProfileScreen from "./screens/ProfileScreen.jsx";
import AdminLoginScreen from "./screens/AdminLoginScreen.jsx";
import AdminHomeScreen from "./screens/AdminHomeScreen";
import AdminPrivateRoute from "./components/AdminPrivateRoute";
import UsersListScreen from "./screens/UsersListScreen";
import AdminAddUser from "./screens/AdminAddUser";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      {/*--------- User Routes --------- */}
      <Route index={true} path="/" element={<HomeScreen />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/register" element={<RegisterScreen />} />
      {/* Private Route */}
      <Route path="" element={<PrivateRoute />}>
        <Route path="/profile" element={<ProfileScreen />} />
      </Route>
      {/* ------- Admin Routes -------- */}
      <Route path="/admin/login" element={<AdminLoginScreen />} />

      {/* Private Route not setted */}
      <Route path="" element={<AdminPrivateRoute />}>
        <Route path="/admin" element={<AdminHomeScreen />} />
        <Route path="/admin/users" element={<UsersListScreen/>}/>
        <Route path="/admin/users/add-user" element={<AdminAddUser/>}/>
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  </Provider>
);
