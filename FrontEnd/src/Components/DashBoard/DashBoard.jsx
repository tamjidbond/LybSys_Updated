import { useEffect, useState } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { User, Book } from "lucide-react";
import Navbar from "../Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import { Fade } from "react-awesome-reveal";

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [stats, setStats] = useState({
    userCount: 0,
    bookCount: 0,
    borrowedBooks: 0,
    returnedBooks: 0,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/");

    const fetchData = async () => {
      try {
        const [statsRes,] = await Promise.all([
          axios.get("http://localhost:5000/dashboard/stats"),
        ]);

        setStats(statsRes.data);
      } catch (err) {
        console.error("Error loading dashboard data:", err);
      }
    };

    fetchData();
  }, [navigate]);

  const pieData = {
    labels: ["Borrowed", "Available"],
    datasets: [
      {
        data: [stats.borrowedBooks, stats.returnedBooks],
        backgroundColor: ["#3b82f6", "#ec4899"],
        borderWidth: 1,
      },
    ],
  };

  const pieOptions = {
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: darkMode ? "#fff" : "#000",
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.label}: ${context.raw}`,
        },
      },
    },
  };

  const statistics = [
    { icon: User, count: stats.userCount, text: "Total Users" },
    { icon: Book, count: stats.bookCount, text: "Total Books" },
  ];

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gradient-to-br from-sky-700 to-blue-800 text-gray-900"
      }`}
    >
      <Navbar />
      <div className="container mx-auto px-6 py-24">
        <button
          onClick={toggleDarkMode}
          className="mb-8 inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-transform transform hover:scale-105 shadow-lg"
        >
          <span className="material-icons">
            {darkMode ? "dark_mode" : "light_mode"}
          </span>
          Toggle {darkMode ? "Light" : "Dark"} Mode
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Pie Chart */}
          <Fade>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl shadow-xl hover:shadow-2xl transition hover:scale-105">
              <Pie data={pieData} options={pieOptions} />
            </div>
          </Fade>

          {/* Stats Cards */}
          <Fade cascade>
            <div className="flex flex-col gap-4">
              {statistics.map((stat, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 p-5 bg-white/10 backdrop-blur-md rounded-xl shadow-lg hover:shadow-xl transition hover:scale-105"
                >
                  <stat.icon className="w-10 h-10 text-yellow-400" />
                  <div>
                    <h4 className="text-2xl font-bold">{stat.count}</h4>
                    <p className="text-sm text-gray-300">{stat.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </Fade>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
