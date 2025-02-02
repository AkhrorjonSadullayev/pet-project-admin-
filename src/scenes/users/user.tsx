import React, { useEffect, useState } from "react";
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
import {
  Checkbox,
  Input,
  Sheet,
  Table,
} from "@mui/joy";
import SearchIcon from "@mui/icons-material/Search";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Sidebar from "../../components/Sidebar"; // Make sure Sidebar is imported here
import axios from "axios";
import { baseApi } from "../../utils/api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Todo {
  _id: string;
  name: string;
  email: string;
  phone: string;
}

type Order = "asc" | "desc";

function getComparator<Key extends keyof any>(order: Order, orderBy: Key) {
  return order === "desc"
    ? (a: any, b: any) => (b[orderBy] < a[orderBy] ? -1 : 1)
    : (a: any, b: any) => (a[orderBy] < b[orderBy] ? -1 : 1);
}

export default function UserComponent() {
  const [order, setOrder] = React.useState<Order>("desc");
  const [selected, setSelected] = useState<string[]>([]);
  const [users, setUsers] = useState<Todo[]>([]);
  const getallTodo = async (search: string) => {
    try {
      const { data } = await axios.get(`${baseApi}/user/get`, {
        params: { search },
      });
      if (data.success) {
        setUsers(data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };


  const toggleSelection = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    getallTodo("");
  }, []);
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("User List", 14, 10);

    // Tanlangan mahsulotlarni olish
    const selectedProducts = users.filter((item) =>
      selected.includes(item._id)
    );

    autoTable(doc, {
      head: [["No", "ID", "Name", "Email", "Phone"]],
      body: selectedProducts.map((item, index) => [
        index + 1,
        item._id,
        `${item.name}`,
        item.email,
        item.phone,
      ]),
    });

    doc.save("user_list.pdf");
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
            <Typography color="primary">Users</Typography>
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
            <Typography level="h2">Users List</Typography>
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
                getallTodo(e.target.value);
              }}
              placeholder="search"
              name="search"
              type="text"
              startDecorator={<SearchIcon />}
              sx={{ width: "200px" }}
            />
          </Box>
          {/* Table */}
          Users: {users.length}
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
                        selected.length > 0 && selected.length !== users.length
                      }
                      checked={selected.length === users.length}
                      onChange={(e) =>
                        setSelected(
                          e.target.checked ? users.map((row) => row._id) : []
                        )
                      }
                    />
                  </th>
                  <th>
                    <Link
                      onClick={() => setOrder(order === "asc" ? "desc" : "asc")}
                      endDecorator={<ArrowDropDownIcon />}
                      sx={{ cursor: "pointer" }}
                    >
                      ID
                    </Link>
                  </th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                </tr>
              </thead>
              <tbody>
                {users.sort(getComparator(order, "_id")).map((row, index) => (
                  <tr key={index}>
                    <td style={{ textAlign: "center" }}>
                      <Checkbox
                        size="sm"
                        checked={selected.includes(row._id)}
                        onChange={() => toggleSelection(row._id)}
                      />
                    </td>
                    <td>{row._id}</td>
                    <td>{row.name}</td>
                    <td>{row.email}</td>
                    <td>{row.phone}</td>
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
