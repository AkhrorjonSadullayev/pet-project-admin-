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
interface UserStat {
  _id: string; // Date string
  count: number; // Number of todos
}

const UserChart: React.FC = () => {
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

 useEffect(()=>{
    const fetchUserStats = async () => {
        const token = localStorage.getItem("token")
        try {
            const { data } = await axios.get(`${baseApi}/user/user-chart`,{
                headers:{
                    Authorization:`Bearer ${token}`
                },
            });
            if(data.success){
                const labels = data.stats.map((item:UserStat)=> item._id);
                const counts = data.stats.map((item:UserStat)=> item.count);
                setChartData({
                    labels,
                    datasets:[
                        {
                            label:"Users Signed Up",
                            data:counts,
                            borderColor:"#1c8896",
                            backgroundColor:"#1c8896",
                            tension:0.4
                        }
                    ],
                })
            }
        } catch (error) {
            console.error("Error fetching user stats:", error);
        }
    }
    fetchUserStats();
 },[])

  return (
    <TodoChartContainer>
        <div className="chart-con">
        <h2>User Analysis</h2>
        <Line className="chart" data={chartData} />
        </div>
    </TodoChartContainer>
  );
};

export default UserChart;
