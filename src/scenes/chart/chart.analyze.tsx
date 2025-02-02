import { Box, CssBaseline, CssVarsProvider } from "@mui/joy"
import TodoChart from "./chart.main"
import Sidebar from "../../components/Sidebar"
import UserChart from "./chart.user"

const ChartAnalyze = () => {
  return (
    <CssVarsProvider disableTransitionOnChange>
    <CssBaseline />
    <Box sx={{ display: "flex", minHeight: "100dvh" }}>
      {/* Sidebar */}
      <Sidebar />
      <TodoChart  />
      <UserChart/>
      {/* Main Content */}
    </Box>
  </CssVarsProvider>
  )
}

export default ChartAnalyze