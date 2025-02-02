import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { baseApi } from "../../utils/api";
import { toast } from "react-toastify";
import axios from "axios";
import { Box, CssBaseline, CssVarsProvider } from "@mui/joy";
import Sidebar from "../../components/Sidebar";
import { AnimalContainer } from "./styles/animal.style";
interface Todo {
  _id: string;
  phone: number;
  type: string;
  location: string;
  title: string;
  desc: string;
  price: number;
  color: string;
  main: string;
  kg: number;
  detail: string;
  detailtwo: string;
  detailthree: string;
}
// Main component function
export const DetailsComponentAnimal = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Todo | null>(null);
  const [mainImage, setMainImage] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTodo = async () => {
      try {
        const { data } = await axios.get(`${baseApi}/todo/get/${id}`);
        setProduct(data.data);
        setMainImage(data.data.main); // Set initial main image
      } catch (error) {
        toast.error("Error fetching todo.");
      }
    };

    if (id) fetchTodo();
  }, [id]);

  const typeRoutes: Record<string, string> = {
    Dog: "dogs",
    Cat: "cats",
    Fish: "fish",
    Rabbit: "rabbit",
    Parrot: "parrot",
  };
const productType = product?.type || "";
const path = typeRoutes[productType] ? `/${typeRoutes[productType]}` : "/not-found";
  const deleteTodo = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication token is missing.");
        return;
      }

      const response = await axios.delete(`${baseApi}/todo/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.data.success) {
        toast.error(response.data.msg || "Failed to delete todo.");
        return;
      }

      toast.success("Todo deleted successfully!");
      navigate(path);
    } catch (error: any) {
      console.error("Error deleting todo:", error);
      toast.error(error.response?.data?.msg || "An unexpected error occurred while deleting.");
    }
  };

  if (!product) return <p>Loading...</p>;

  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <Box sx={{ display: "flex", minHeight: "100dvh" }}>
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            p: 3,
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <AnimalContainer style={{ width: "80%", maxWidth: "900px" }}>
            <h2 className="title">{product.title}</h2>

            {/* Product Details */}
            <div className="type-con">
              <h3>🎨 Color: <span style={{ fontWeight: "bold" }}>{product.color}</span></h3>
              <h3>⚖️ Weight: <span style={{ fontWeight: "bold" }}>{product.kg}kg</span></h3>
              <h3>📍 Location: <span style={{ fontWeight: "bold" }}>{product.location}</span></h3>
              <h3>📞 Phone: <span style={{ fontWeight: "bold" }}>{product.phone}</span></h3>
              <h3>💰 Price: <span style={{ fontWeight: "bold" }}>${product.price}</span></h3>
            </div>

            <p className="desc">{product.desc}</p>

            {/* Main Image (clickable for zoom) */}
            {mainImage && (
              <img
                src={mainImage}
                alt="main-img"
                className="main-img"
                style={{
                  width: "100%",
                  maxWidth: "600px",
                  height: "400px",
                  borderRadius: "10px",
                  objectFit: "cover",
                  cursor: "pointer",
                  transition: "transform 0.3s ease-in-out",
                }}
                onClick={(e) => {
                  e.currentTarget.style.transform = "scale(1.2)";
                  setTimeout(() => {
                    e.currentTarget.style.transform = "scale(1)";
                  }, 500);
                }}
              />
            )}

            {/* Detail Images */}
            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              {[product.main, product.detail, product.detailtwo, product.detailthree].map(
                (img, index) =>
                  img && (
                    <img
                      key={index}
                      src={img}
                      alt={`detail-img-${index}`}
                      className="details-img"
                      style={{
                        width: "100px",
                        height: "100px",
                        borderRadius: "6px",
                        objectFit: "cover",
                        border: "2px solid #ddd",
                        cursor: "pointer",
                        transition: "transform 0.2s ease-in-out",
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
                      onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
                      onClick={() => setMainImage(img)} // Change main image on click
                    />
                  )
              )}
            </div>

            {/* Delete Button */}
            <button
              onClick={() => deleteTodo(product._id)}
              className="delete-button"
              style={{
                marginTop: "16px",
                padding: "10px 20px",
                backgroundColor: "#e74c3c",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "bold",
                transition: "background 0.3s ease",
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#c0392b")}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#e74c3c")}
            >
              🗑️ Delete
            </button>
          </AnimalContainer>
        </Box>
      </Box>
    </CssVarsProvider>
  );
};
