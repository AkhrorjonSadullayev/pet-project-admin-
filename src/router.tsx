import { Route, Routes } from "react-router-dom";
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const loadJwtDecode = async () => {
      try {
        const { jwtDecode } = await import("jwt-decode");
        const decodedToken: any = jwtDecode(token);
        console.log(decodedToken);

        setIsAuthenticated(true);
        setIsAdmin(decodedToken.roles?.includes("ADMIN"));
      } catch (error) {
        console.error("Invalid token", error);
      }
    };

    loadJwtDecode();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<SignIn />} />
      <Route path="/users" element={<UsersComponent />} />
      <Route path="/dog" element={<DogComponent />} />
      <Route path="/cat" element={<CatComponent />} />
      <Route path="/rabbit" element={<RabbitComponent />} />
      <Route path="/fish" element={<FishComponent />} />
      <Route path="/parrot" element={<ParrotComponent />} />
      <Route path="/products" element={<ProductsComponent />} />
      <Route path="/details/:id" element={<DetailsComponentFood />} />
      <Route path="/details-animal/:id" element={<DetailsComponentAnimal />} />
      <Route path="/chart" element={<ChartAnalyze />} />
      <Route path="/test" element={<JoySignInSideTemplate />} />
    </Routes>
  );
};

export default RouterComponent;
