import { useEffect, useState } from "react";
import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Breadcrumbs from "@mui/joy/Breadcrumbs";
import Link from "@mui/joy/Link";
import Typography from "@mui/joy/Typography";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import { Checkbox, Input, Sheet, Table } from "@mui/joy";
import SearchIcon from "@mui/icons-material/Search";
import Sidebar from "../../components/Sidebar";
import axios from "axios";
import { baseApi } from "../../utils/api";
import { toast } from "react-toastify";
import { Link as RouterLink } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
interface Todo {
  _id: string;
  type: string;
  location: string;
  title: string;
  desc: string;
  price: number;
  color: string;
  main: string;
  detail: string;
  detailtwo: string;
  detailthree: string;
}
export default function DogComponent() {
  const [selected, setSelected] = useState<string[]>([]);
  const [products, setProducts] = useState<Todo[]>([]);
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

  useEffect(() => {
    getAllTodos("");
  }, []);

  const filteredOriginal = products.filter((item) => item.type === "Dog");
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Dog List", 14, 10);

    // Tanlangan mahsulotlarni olish
    const selectedProducts = products.filter((item) =>
      selected.includes(item._id)
    );

    autoTable(doc, {
      head: [["No", "Title", "Price", "Location"]],
      body: selectedProducts.map((item, index) => [
        index + 1,
        item.title,
        `$${item.price}`,
        item.location,
      ]),
    });

    doc.save("dog_list.pdf");
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
          <Breadcrumbs separator={<ChevronRightRoundedIcon />} sx={{ mb: 2 }}>
            <Link underline="none" color="neutral">
              <HomeRoundedIcon />
            </Link>
            <Link underline="hover" color="neutral">
              Dashboard
            </Link>
            <Typography color="primary">Dog</Typography>
          </Breadcrumbs>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            <Typography level="h2">Dog List</Typography>
            <Button
              startDecorator={<DownloadRoundedIcon />}
              size="sm"
              color="primary"
              onClick={generatePDF} // <-- PDF yuklab olish funksiyasiga bog‘landi
            >
              Download PDF
            </Button>
          </Box>
          {/* Filters and Search */}
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Input
              onChange={(e) => {
                getAllTodos(e.target.value);
              }}
              placeholder="search"
              name="search"
              type="text"
              startDecorator={<SearchIcon />}
              sx={{ width: "200px" }}
            />
          </Box>
          {/* Table */}
          Products: {filteredOriginal.length}
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
                  <th>Price</th>
                  <th>Image</th>
                  <th>Location</th>
                  <th>Detail</th>
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
                    <td style={{ color: "blue" }}>
                      <RouterLink to={`/details-animal/${row._id}`}>
                        View
                      </RouterLink>
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
