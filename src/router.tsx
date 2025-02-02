import { Navigate, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import UsersComponent from "./scenes/users/user";
import DogComponent from "./scenes/animals/Dog";
import CatComponent from "./scenes/animals/cat";
import RabbitComponent from "./scenes/animals/rabbit";
import FishComponent from "./scenes/animals/fish";
import ParrotComponent from "./scenes/animals/parrot";
import SignIn from "./components/login";
import ProductsComponent from "./scenes/products/products";
import JoySignInSideTemplate from "./components/test";
import DetailsComponentFood from "./scenes/details/products-details";
import { DetailsComponentAnimal } from "./scenes/details/animal-details";
import ChartAnalyze from "./scenes/chart/chart.analyze";

const RouterComponent = () => {
  const [jwtDecode, setJwtDecode] = useState<any>(null);
  const token = localStorage.getItem("token"); // tokenni localStorage dan olish

  useEffect(() => {
    // Asinxron import qilish
    const loadJwtDecode = async () => {
      const jwt = await import("jwt-decode");
      setJwtDecode(() => jwt.jwtDecode);
    };
    loadJwtDecode();
  }, []);

  let isAuthenticated = false;
  let isAdmin = false;

  if (token) {
    try {
      const decodedToken = jwtDecode(token); // tokenni dekodlash
      console.log(decodedToken);
      isAuthenticated = true;
      isAdmin = decodedToken.roles.includes("ADMIN");
    } catch (error) {
      console.error("Invalid token", error);
    }
  }

  return (
    <Routes>
      <Route path="/" element={<SignIn />} />
      <Route
        path="/users"
        element={isAuthenticated && isAdmin ? <UsersComponent /> : <Navigate to="/" />}
      />
      <Route
        path="/dog"
        element={isAuthenticated ? <DogComponent /> : <Navigate to="/" />}
      />
      <Route
        path="/cat"
        element={isAuthenticated ? <CatComponent /> : <Navigate to="/" />}
      />
      <Route
        path="/rabbit"
        element={isAuthenticated ? <RabbitComponent /> : <Navigate to="/" />}
      />
      <Route
        path="/fish"
        element={isAuthenticated ? <FishComponent /> : <Navigate to="/" />}
      />
      <Route
        path="/parrot"
        element={isAuthenticated ? <ParrotComponent /> : <Navigate to="/" />}
      />
      <Route
        path="/products"
        element={isAuthenticated ? <ProductsComponent /> : <Navigate to="/" />}
      />
      <Route
        path="/details/:id"
        element={isAuthenticated ? <DetailsComponentFood /> : <Navigate to="/" />}
      />
      <Route
        path="/details-animal/:id"
        element={isAuthenticated ? <DetailsComponentAnimal /> : <Navigate to="/" />}
      />
      <Route
        path="/chart"
        element={isAuthenticated ? <ChartAnalyze /> : <Navigate to="/" />}
      />
       <Route
        path="/test"
        element={isAuthenticated ? <JoySignInSideTemplate /> : <Navigate to="/" />}
      />
    </Routes>
  );
};

export default RouterComponent;
