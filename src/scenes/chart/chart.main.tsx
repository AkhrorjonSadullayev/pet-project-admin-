import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { baseApi } from "../../utils/api";
import { TodoChartContainer } from "./styles/todoChart.style";

// Register Chart.js components
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Define TypeScript interface for API response
interface TodoStat {
  _id: string; // Date string
  count: number; // Number of todos
}

const TodoChart: React.FC = () => {
  const [chartData, setChartData] = useState<{
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
      tension: number;
    }[];
  }>({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const fetchTodoStats = async () => {
     const token = localStorage.getItem("token");
      try {
        const { data } = await axios.get(`${baseApi}/todo/todo-analysis`,{
            headers: {
                Authorization: `Bearer ${token}`, // Send token
              },
        }
            
        );

        if (data.success) {
          const labels = data.stats.map((item: TodoStat) => item._id);
          const counts = data.stats.map((item: TodoStat) => item.count);

          setChartData({
            labels,
            datasets: [
              {
                label: "Products Added",
                data: counts,
                borderColor: "#ea8819",
                backgroundColor: "#ea8819",
                tension: 0.4,
              },
            ],
          });
        }
      } catch (error) {
        console.error("Error fetching todo stats:", error);
      }
    };

    fetchTodoStats();
  }, []);

  return (
    <TodoChartContainer>
        <div className="chart-con">
        <h2>Product Analysis</h2>
        <Line className="chart" data={chartData} />
        </div>
    </TodoChartContainer>
  );
};

export default TodoChart;
