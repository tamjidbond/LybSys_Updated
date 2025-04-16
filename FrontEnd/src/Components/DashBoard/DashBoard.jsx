import { useEffect, useState } from "react";
import axios from "axios";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { User, BookOpen, BookCheck, BookX } from "lucide-react";
import Navbar from "../Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import { Fade } from "react-awesome-reveal";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [stats, setStats] = useState({
    userCount: 0,
    bookCount: 0,
    borrowedBooks: 0,
    returnedBooks: 0,
  });

  const greeting = () => {
    const hr = new Date().getHours();
    if (hr < 12) return "Good Morning ☀️";
    if (hr < 18) return "Good Afternoon 🌤️";
    return "Good Evening 🌙";
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/");

    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/dashboard/stats");
        setStats(res.data);
      } catch (err) {
        console.error("Dashboard error:", err);
      }
    };

    fetchData();
  }, [navigate]);

  const pieData = {
    labels: ["Borrowed", "Returned"],
    datasets: [
      {
        data: [stats.borrowedBooks, stats.returnedBooks],
        backgroundColor: ["#3b82f6", "#ec4899"],
        borderWidth: 1,
      },
    ],
  };

  const barData = {
    labels: ["Users", "Books", "Borrowed", "Returned"],
    datasets: [
      {
        label: "Statistics",
        data: [
          stats.userCount,
          stats.bookCount,
          stats.borrowedBooks,
          stats.returnedBooks,
        ],
        backgroundColor: ["#0ea5e9", "#8b5cf6", "#f97316", "#22c55e"],
      },
    ],
  };

  const barOptions = {
    scales: {
      y: { beginAtZero: true },
    },
    plugins: {
      legend: { display: false },
    },
  };

  const statistics = [
    { icon: User, count: stats.userCount, text: "Total Users" },
    { icon: BookOpen, count: stats.bookCount, text: "Total Books" },
    { icon: BookCheck, count: stats.borrowedBooks, text: "Borrowed Books" },
    { icon: BookX, count: stats.returnedBooks, text: "Returned Books" },
  ];

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const downloadReport = () => {
    const doc = new jsPDF();
    doc.text("Library Dashboard Report", 10, 10);
    doc.text(`Users: ${stats.userCount}`, 10, 20);
    doc.text(`Books: ${stats.bookCount}`, 10, 30);
    doc.text(`Borrowed: ${stats.borrowedBooks}`, 10, 40);
    doc.text(`Returned: ${stats.returnedBooks}`, 10, 50);
    doc.save("library_report.pdf");
  };

  return (
    <div
      className={`min-h-screen transition duration-300  ${
        darkMode
          ? "bg-gray-900 text-white"
          : "bg-gradient-to-br from-sky-700 to-blue-900 text-white"
      }`}
    >
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8 ">
          <h1 className="text-3xl font-semibold">{greeting()}, Admin 👋</h1>
          <div className="flex gap-4">
            <button
              onClick={toggleDarkMode}
              className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-700 transition shadow"
            >
              {darkMode ? "☀️ Light" : "🌙 Dark"}
            </button>
            <button
              onClick={downloadReport}
              className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 transition shadow"
            >
              📄 Download Report
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <Fade cascade damping={0.1}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {statistics.map((stat, idx) => (
              <div
                key={idx}
                className="p-6 rounded-xl shadow-lg bg-white/10 backdrop-blur-md hover:scale-105 transition transform flex items-center gap-4"
              >
                <stat.icon className="w-10 h-10 text-yellow-400" />
                <div>
                  <p className="text-2xl font-bold">{stat.count}</p>
                  <p className="text-sm">{stat.text}</p>
                </div>
              </div>
            ))}
          </div>
        </Fade>

        <div className="flex flex-col gap-6 md:flex-col lg:flex-row"> 
          {/* Charts Section */}
          <div className="flex-1">
            <Fade>
              <div className="bg-white/10 p-6 rounded-xl shadow-lg hover:shadow-2xl transition">
                <h3 className="mb-4 font-semibold text-lg">
                  Borrowed vs Returned
                </h3>
                <Pie data={pieData} />
              </div>
            </Fade>
          </div>

          <div className="flex-1">
            {/* summary  */}
            <div>
              <Fade>
                <div className="bg-white/9 p-6 rounded-xl shadow-lg hover:shadow-2xl transition text-white">
                  <h3 className="mb-4 font-semibold text-lg">
                    Overall Summary
                  </h3>
                  <Bar data={barData} options={barOptions} />
                </div>
              </Fade>
            </div>

            {/* Recent Activity */}
            <div className="mt-12 bg-white/10 p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-semibold mb-4">
                📚 Recent Activities
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  John borrowed <span className="italic">“Atomic Habits”</span>
                </li>
                <li>
                  Sarah returned{" "}
                  <span className="italic">“Rich Dad Poor Dad”</span>
                </li>
                <li>
                  Alex added new book{" "}
                  <span className="italic">“The Psychology of Money”</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
