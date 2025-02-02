import axios from "axios";
import { toast } from "react-toastify";
import { baseApi } from "../../utils/api";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { Box, CssBaseline, CssVarsProvider } from "@mui/joy";
import { Container } from "./styles/products.style";

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
const DetailsComponentFood = () => {
  const { id } = useParams(); 
  const [product, setProduct] = useState<Todo | null>(null);
  const navigate = useNavigate();
useEffect(() => {
    const fetchTodo = async () => {
      try {
        const { data } = await axios.get(`${baseApi}/todo/get/${id}`);
        setProduct(data.data);
       
      } catch (error) {
        toast.error("Error fetching todo.");
      }
    };

    if (id) fetchTodo();
  }, [id]);
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
      navigate("/products");
    } catch (error: any) {
      console.error("Error deleting todo:", error);
  
      const errorMessage =
        error.response?.data?.msg || "An unexpected error occurred while deleting.";
      toast.error(errorMessage);
    }
  };
  
  if (!product) return <p>Loading...</p>;
  return (
    <>
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
            gap: 2,
          }}
        >
<Container
>
  <h2 className="title">
    {product.title}
  </h2>

  {/* Product Details */}

  <div className="type-con">
    <h3>
      🎨 Color: <span style={{ fontWeight: "bold" }}>{product.color}</span>
    </h3>
    <h3>
      ⚖️ Weight: <span style={{ fontWeight: "bold" }}>{product.kg}kg</span>
    </h3>
    <h3>
      📍 Type: <span style={{ fontWeight: "bold" }}>{product.location}</span>
    </h3>
    <h3>
      📞 Phone: <span style={{ fontWeight: "bold" }}>{product.phone}</span>
    </h3>
    <h3>
      💰 Price: <span style={{ fontWeight: "bold" }}>${product.price}</span>
    </h3>
  </div>

  <p className="desc">
    {product.desc}
  </p>

  {/* Main Image */}
  {product.main && (
    <img
      src={product.main}
      alt="main-img"
      className="main-img"
    />
  )}

  {/* Detail Images */}
  <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
    {product.detail && (
      <img
        src={product.detail}
        alt="detail-img"
        className="details-img"
        style={{
          transition: "transform 0.2s ease-in-out",
        }}
        onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
        onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
      />
    )}
    {product.detailtwo && (
      <img
        src={product.detailtwo}
        alt="detailtwo-img"
        className="details-img"
        style={{
          transition: "transform 0.2s ease-in-out",
        }}
        onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
        onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
      />
    )}
    {product.detailthree && (
      <img
        src={product.detailthree}
        alt="detailthree-img"
        className="details-img"
        style={{
          transition: "transform 0.2s ease-in-out",
        }}
        onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
        onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
      />
    )}
  </div>

  {/* Delete Button */}
  <button
  onClick={()=> deleteTodo(product._id)}
  className="delete-button"
    style={{
      transition: "background 0.3s ease",
    }}
    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#c0392b")}
    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#e74c3c")}
  >
    🗑️ Delete
  </button>
</Container>


        </Box>
      </Box>
    </CssVarsProvider>
    </>
  );
};

export default DetailsComponentFood;
