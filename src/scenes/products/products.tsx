import React, {
  ChangeEvent,
  FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { baseApi } from "../../utils/api";
import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import { Link as RouterLink } from "react-router-dom";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import {
  Box,
  Breadcrumbs,
  Button,
  Checkbox,
  Divider,
  Dropdown,
  IconButton,
  Input,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  Modal,
  ModalClose,
  ModalDialog,
  Sheet,
  Table,
  Typography,
} from "@mui/joy";
import Sidebar from "../../components/Sidebar";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
interface Todo {
  _id: string;
  type: string;
  location: string;
  title: string;
  desc: string;
  price: number;
  kg: number;
  color: string;
  main: string;
  detail: string;
  detailtwo: string;
  detailthree: string;
}

export default function ProductsComponent() {
  const [selected, setSelected] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [products, setProducts] = useState<Todo[]>([]);
  const [title, setTitle] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [phone, setPhone] = useState<number | undefined>();
  const [kg, setKg] = useState<number | undefined>();
  const [desc, setDesc] = useState<string>("");
  const [selectId, setSelectId] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [price, setPrice] = useState<number | undefined>();
  const [color, setColor] = useState<string>("");
  const [main, setMain] = useState<string>("");
  const [detail, setDetail] = useState<string>("");
  const [detailtwo, setDetailtwo] = useState<string>("");
  const [detailthree, setDetailthree] = useState<string>("");

  const tokenRef = useRef<string | null>(localStorage.getItem("token"));

  const countries = [
    { name: "Dog Food", cities: ["Chopped", "Dry"] },
    { name: "Cat Food", cities: ["Chopped", "Dry"] },
    { name: "Fish Food", cities: ["Fish Food"] },
    { name: "Parrot Food", cities: ["Parrot Food"] },
    { name: "Rabbit Food", cities: ["Rabbit Food"] },
    {
      name: "Accessories",
      cities: ["For Dog", "For Cat", "For Parrot", "For Rabbit"],
    },
    {
      name: "Pet Toys",
      cities: ["Dog Toy", "Cat Toy", "Rabbit Toy", "Parrot Toy"],
    },
    {
      name: "Small Pet Food",
      cities: ["Dog Food", "Cat Food", "Rabbit Food", "Parrot Food"],
    },
  ];
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const food = e.target.value;
    setType(food); // State-ni to'g'rilash

    setLocation("");
  };
  const countryOptions = countries.map((country) => (
    <option key={country.name} value={country.name}>
      {country.name}
    </option>
  ));
  const cities =
    countries.find((country) => country.name === type)?.cities || [];
  const cityOptions = cities.map((city) => (
    <option key={city} value={city}>
      {city}
    </option>
  ));
  const handleColorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setColor(e.target.value); // State-ni to'g'rilash
  };
  const handleChangeInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    switch (name) {
      case "title":
        setTitle(value);
        break;
      case "desc":
        setDesc(value);
        break;
      case "price":
        setPrice(Number(value));
        break;
      case "phone":
        setPhone(Number(value));
        break;
      case "kg":
        setKg(Number(value));
        break;
      default:
        break;
    }
  };
  const addTodo = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token = tokenRef.current;

    if (!token) {
      toast.error("Token is missing. Please log in.");
      return;
    }

    const todoData: Record<string, any> = {
      type,
      title,
      desc,
      price,
      phone,
      location,
      color,
      kg,
    };
    if (main) todoData.main = main;
    if (detail) todoData.detail = detail;
    if (detailtwo) todoData.detailtwo = detailtwo;
    if (detailthree) todoData.detailthree = detailthree;

    try {
      if (!selectId) {
        // Create new Todo
        const { data } = await axios.post(`${baseApi}/todo/add`, todoData, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (data.success) {
          toast.success("Successfully added!");
          resetForm();
        } else {
          toast.error(data.msg || "Failed to add todo.");
        }
      } else {
        // Update existing Todo
        const { data } = await axios.put(
          `${baseApi}/todo/edit/${selectId}`,
          todoData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (data.success) {
          toast.success("Successfully updated!");
          resetForm();
        } else {
          toast.error(data.msg || "Failed to update todo.");
        }
      }
    } catch (error: any) {
      console.error(error);
      toast.error(
        error.response?.data?.msg || "An error occurred. Please try again."
      );
    }
  };
  const uploadFile = async (
    e: ChangeEvent<HTMLInputElement>,
    fieldName: string
  ) => {
    if (!e.target.files?.length) {
      alert("No file selected.");
      return;
    }
    const formData = new FormData();
    formData.append(fieldName, e.target.files[0]);

    try {
      const { data } = await axios.post(`${baseApi}/upload`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (data.success) {
        switch (fieldName) {
          case "main":
            setMain(data.files[0].filePath);
            break;
          case "detail":
            setDetail(data.files[0].filePath);
            break;
          case "detailtwo":
            setDetailtwo(data.files[0].filePath);
            break;
          case "detailthree":
            setDetailthree(data.files[0].filePath);
            break;
          default:
            break;
        }
        toast.success(`${fieldName} uploaded successfully!`);
      } else {
        toast.error("File upload failed.");
      }
    } catch (error) {
      console.error("File upload error:", error);
      alert("File upload failed. Please try again.");
    }
  };
  const getAllTodos = async (search: string) => {
    try {
      const { data } = await axios.get(`${baseApi}/todo/get-all`, {
        params: { search },
      });
      if (data.success) {
        setProducts(data.data);
      }
    } catch (error) {
      toast.error("Error fetching todos.");
    }
  };

  const toggleSelection = (id: string) => {
    setSelected((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((itemId) => itemId !== id)
        : [...prevSelected, id]
    );
  };
  const deleteTodo = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication token is missing.");
        return;
      }

      const { data } = await axios.delete(`${baseApi}/todo/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      data.success
        ? toast.success("Todo deleted successfully!")
        : toast.error(data.msg || "Failed to delete todo.");
    } catch (error: any) {
      console.error("Error deleting todo:", error);
      toast.error(error.response?.data?.msg || "Error deleting todo.");
    }
  };
  const resetForm = () => {
    setTitle("");
    setDesc("");
    setMain("");
    setDetail("");
    setDetailtwo("");
    setDetailthree("");
    setLocation("");
    setType("");
    setPrice(0);
    setPhone(0);
    setKg(0);
    setSelectId("");
  };

  const handleTypeChange = (selectedType: string) => {
    setType(selectedType);
  };
  const filteredOriginal = useMemo(() => {
    const allowedTypes = new Set([
      "",
      "Dog Food",
      "Cat Food",
      "Rabbit Food",
      "Parrot Food",
      "Fish Food",
      "Pet Toys",
      "Accessories",
      "Small Pet Food",
    ]);

    return type && allowedTypes.has(type)
      ? products.filter((item) => item.type === type)
      : [];
  }, [products, type]);

  useEffect(() => {
    getAllTodos("");
  }, []);

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Pet Food List", 14, 10);

    // Tanlangan mahsulotlarni olish
    const selectedProducts = products.filter((item) =>
      selected.includes(item._id)
    );

    autoTable(doc, {
      head: [["No", "Title", "Price", "Type"]],
      body: selectedProducts.map((item, index) => [
        index + 1,
        item.title,
        `$${item.price}`,
        item.location,
      ]),
    });

    doc.save("products_list.pdf");
  };
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
            gap: 2,
          }}
        >
          {/* Header */}
          <Breadcrumbs sx={{ mb: 2 }}>
            <Link underline="none" color="neutral"></Link>
            <Link underline="hover" color="neutral">
              Dashboard
            </Link>
            <Typography color="primary">Products</Typography>
          </Breadcrumbs>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Input
              onChange={(e) => {
                getAllTodos(e.target.value);
              }}
              placeholder="search"
              name="search"
              type="text"
              sx={{ width: "200px" }}
            />
          </Box>
          {/* Filters Modal */}
          <Modal open={open} onClose={() => setOpen(false)}>
            <ModalDialog>
              <ModalClose />
              <Typography level="h2">
                <form
                  onSubmit={addTodo}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr", // 2 ta ustun
                    gap: "16px", // Elementlar o'rtasidagi bo'shliq
                    maxWidth: "800px",
                    margin: "0 auto",
                    padding: "16px",
                    borderRadius: "8px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    backgroundColor: "#f9f9f9",
                    fontFamily: "Arial, sans-serif",
                  }}
                >
                  {/* Type */}
                  <label style={{ fontSize: "14px", color: "#555" }}>
                    Food
                  </label>
                  <select
                    value={type}
                    onChange={handleChange}
                    required
                    style={{
                      padding: "8px",
                      borderRadius: "4px",
                      border: "1px solid #ccc",
                      fontSize: "14px",
                      color: "#333",
                    }}
                  >
                    {countryOptions}
                  </select>

                  {/* Location */}
                  <label style={{ fontSize: "14px", color: "#555" }}>
                    Type
                  </label>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                    style={{
                      padding: "8px",
                      borderRadius: "4px",
                      border: "1px solid #ccc",
                      fontSize: "14px",
                      color: "#333",
                    }}
                  >
                    <option value="" disabled>
                      Select Type
                    </option>
                    {cityOptions}
                  </select>

                  {/* Title */}
                  <label style={{ fontSize: "14px", color: "#555" }}>
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={title}
                    onChange={handleChangeInput}
                    placeholder="Enter Title"
                    required
                    style={{
                      padding: "8px",
                      borderRadius: "4px",
                      border: "1px solid #ccc",
                      fontSize: "14px",
                      color: "#333",
                    }}
                  />
                  <label style={{ fontSize: "14px", color: "#555" }}>
                    Phone
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={phone}
                    onChange={handleChangeInput}
                    placeholder="Enter Phone"
                    required
                    style={{
                      padding: "8px",
                      borderRadius: "4px",
                      border: "1px solid #ccc",
                      fontSize: "14px",
                      color: "#333",
                    }}
                  />

                  {/* Description */}
                  <label style={{ fontSize: "14px", color: "#555" }}>
                    Description
                  </label>
                  <textarea
                    name="desc"
                    value={desc}
                    onChange={handleChangeInput}
                    placeholder="Enter Description"
                    required
                    style={{
                      padding: "8px",
                      borderRadius: "4px",
                      border: "1px solid #ccc",
                      fontSize: "14px",
                      color: "#333",
                      resize: "none",
                    }}
                  />

                  {/* Price */}
                  <label style={{ fontSize: "14px", color: "#555" }}>
                    Price
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={price}
                    onChange={handleChangeInput}
                    placeholder="Enter Price only in US dollars($)"
                    required
                    style={{
                      padding: "8px",
                      borderRadius: "4px",
                      border: "1px solid #ccc",
                      fontSize: "14px",
                      color: "#333",
                    }}
                  />

                  {/* Color */}
                  <label style={{ fontSize: "14px", color: "#555" }}>
                    Color
                  </label>
                  <select
                    value={color}
                    onChange={handleColorChange}
                    required
                    style={{
                      padding: "8px",
                      borderRadius: "4px",
                      border: "1px solid #ccc",
                      fontSize: "14px",
                      color: "#333",
                    }}
                  >
                    <option value="" disabled>
                      Select Color
                    </option>
                    {[
                      "White",
                      "Black",
                      "Brown",
                      "Yellow",
                      "Violet",
                      "Green",
                      "Red",
                      "Grey",
                      "Blue",
                      "Orange",
                      "Pink",
                    ].map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                  <label style={{ fontSize: "14px", color: "#555" }}>
                    Weight
                  </label>
                  <input
                    type="number"
                    name="kg"
                    value={kg}
                    onChange={handleChangeInput}
                    placeholder="Enter Weight(kg)"
                    required
                    step={0.01} // O'nlik kasrli raqamlarni kiritishga ruxsat beradi
                    style={{
                      padding: "8px",
                      borderRadius: "4px",
                      border: "1px solid #ccc",
                      fontSize: "14px",
                      color: "#333",
                    }}
                  />
                  {/* Main Image */}

                  <label style={{ fontSize: "14px", color: "#555" }}>
                    Main Image
                  </label>
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <input
                      type="file"
                      onChange={(e) => uploadFile(e, "main")}
                      accept="image/*"
                      required
                      style={{
                        padding: "8px",
                        borderRadius: "4px",
                        border: "1px solid #ccc",
                        fontSize: "14px",
                      }}
                    />
                    <img
                      src={main || "default_image_url"} // Replace "default_image_url" with a valid default URL
                      alt="Preview"
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "4px",
                      }}
                    />
                  </div>

                  {/* Detail Images */}
                  <label style={{ fontSize: "14px", color: "#555" }}>
                    Detail Image 1
                  </label>
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <input
                      type="file"
                      onChange={(e) => uploadFile(e, "detail")}
                      accept="image/*"
                      required
                      style={{
                        padding: "8px",
                        borderRadius: "4px",
                        border: "1px solid #ccc",
                        fontSize: "14px",
                      }}
                    />
                    <img
                      src={detail || "default_image_url"} // Replace "default_image_url" with a valid default URL
                      alt="Preview"
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "4px",
                      }}
                    />
                  </div>

                  <label style={{ fontSize: "14px", color: "#555" }}>
                    Detail Image 2
                  </label>
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <input
                      type="file"
                      onChange={(e) => uploadFile(e, "detailtwo")}
                      accept="image/*"
                      required
                      style={{
                        padding: "8px",
                        borderRadius: "4px",
                        border: "1px solid #ccc",
                        fontSize: "14px",
                      }}
                    />
                    <img
                      src={detailtwo || "default_image_url"} // Replace "default_image_url" with a valid default URL
                      alt="Preview"
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "4px",
                      }}
                    />
                  </div>

                  <label style={{ fontSize: "14px", color: "#555" }}>
                    Detail Image 3
                  </label>
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <input
                      type="file"
                      onChange={(e) => uploadFile(e, "detailthree")}
                      accept="image/*"
                      required
                      style={{
                        padding: "8px",
                        borderRadius: "4px",
                        border: "1px solid #ccc",
                        fontSize: "14px",
                      }}
                    />
                    <img
                      src={detailthree || "default_image_url"} // Replace "default_image_url" with a valid default URL
                      alt="Preview"
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "4px",
                      }}
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    style={{
                      padding: "10px",
                      backgroundColor: "#2874a6 ",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      fontSize: "14px",
                      cursor: "pointer",
                      gridColumn: "span 2",
                      textAlign: "center",
                    }}
                  >
                    {selectId ? "Edit" : "Add"}
                  </button>
                </form>
              </Typography>
            </ModalDialog>
          </Modal>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            <Typography level="h2">Product List</Typography>

            <div style={{ display: "flex", gap: "10px" }}>
              <IconButton
                size="lg"
                variant="outlined"
                onClick={() => setOpen(true)}
              >
                Add Product
              </IconButton>
              <Button
                startDecorator={<DownloadRoundedIcon />}
                size="sm"
                color="primary"
                onClick={generatePDF} // <-- PDF yuklab olish funksiyasiga bog‘landi
              >
                Download PDF
              </Button>
            </div>
          </Box>
          {/* Filters and Search */}
          {/* Table */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
            }}
          >
            Products: {filteredOriginal.length}
            <select
              value={type}
              onChange={(e) => handleTypeChange(e.target.value)}
              style={{
                border: "1px solid #d1d5db",
                backgroundColor: "#ffffff",
                color: "#4b5563",
                fontSize: "14px",
                borderRadius: "8px",
                cursor: "pointer",
                padding: "8px",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                transition: "border-color 0.2s, box-shadow 0.2s",
              }}
            >
              <option value=""></option>
              <option value="Dog Food">Dog Food</option>
              <option value="Cat Food">Cat Food</option>
              <option value="Fish Food">Fish Food</option>
              <option value="Parrot Food">Parrot Food</option>
              <option value="Rabbit Food">Rabbit Food</option>
              <option value="Pet Toys">Pet Toys</option>
              <option value="Accessories">Accessories</option>
              <option value="Small Pet Food">Small Pet Food</option>
            </select>
          </div>
          <Sheet
            variant="outlined"
            sx={{ borderRadius: "sm", overflow: "auto" }}
          >
            <Table
              stickyHeader
              hoverRow
              sx={{
                "--TableCell-paddingY": "8px",
                "--TableCell-paddingX": "12px",
              }}
            >
              <thead>
                <tr>
                  <th style={{ width: 48, textAlign: "center" }}>
                    <Checkbox
                      size="sm"
                      indeterminate={
                        selected.length > 0 &&
                        selected.length !== filteredOriginal.length
                      }
                      checked={selected.length === filteredOriginal.length}
                      onChange={(e) =>
                        setSelected(
                          e.target.checked
                            ? filteredOriginal.map((row) => row._id)
                            : []
                        )
                      }
                    />
                  </th>
                  <th style={{ textAlign: "center" }}>No</th>
                  <th>Title</th>
                  <th>Image</th>
                  <th>Price</th>
                  <th>Type</th>
                  <th>details</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredOriginal.map((row, index) => (
                  <tr key={row._id}>
                    <td style={{ textAlign: "center" }}>
                      <Checkbox
                        size="sm"
                        checked={selected.includes(row._id)}
                        onChange={() => toggleSelection(row._id)}
                      />
                    </td>
                    <td style={{ textAlign: "center" }}>{index + 1}</td>
                    <td>{row.title}</td>
                    <td>
                      <img
                        style={{
                          width: "50px",
                          height: "50px",
                          borderRadius: "10px",
                        }}
                        src={row.main}
                        alt="main-image"
                      />
                    </td>
                    <td>${row.price}</td>
                    <td>{row.location}</td>
                    <td style={{ color: "blue", cursor: "pointer" }}>
                      <RouterLink to={`/details/${row._id}`}>View</RouterLink>
                    </td>
                    <td>
                      <Dropdown>
                        <MenuButton
                          slots={{ root: IconButton }}
                          slotProps={{
                            root: {
                              variant: "plain",
                              color: "neutral",
                              size: "sm",
                            },
                          }}
                        >
                          <MoreHorizRoundedIcon />
                        </MenuButton>
                        <Menu size="sm" sx={{ minWidth: 140 }}>
                          <MenuItem
                            onClick={() => {
                              setSelectId(row._id);
                              setTitle(row.title);
                              setDesc(row.desc);
                              setMain(row.main);
                              setDetail(row.detail);
                              setDetailtwo(row.detailtwo);
                              setDetailthree(row.detailthree);
                              setOpen(true);
                            }}
                            style={{
                              padding: "8px 16px",
                              color: "black",
                              border: "none",
                              borderRadius: "4px",
                              cursor: "pointer",
                            }}
                          >
                            Edit
                          </MenuItem>
                          <Divider />
                          <MenuItem
                            onClick={() => deleteTodo(row._id)}
                            style={{
                              padding: "8px 16px",
                              color: "red",
                              border: "none",
                              borderRadius: "4px",
                              cursor: "pointer",
                            }}
                          >
                            Delete
                          </MenuItem>
                        </Menu>
                      </Dropdown>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Sheet>
        </Box>
      </Box>
    </CssVarsProvider>
  );
}
