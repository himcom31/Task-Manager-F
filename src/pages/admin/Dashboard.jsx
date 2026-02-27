import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import DashboardLayout from "../../components/DashboardLayout"
import axiosInstance from "../../utils/axioInstance"
import moment from "moment"
import { useNavigate } from "react-router-dom"
import RecentTasks from "../../components/RecentTasks"
import CustomPieChart from "../../components/CustomPieChart"
import CustomBarChart from "../../components/CustomBarChart"

const COLORS = ["#FF6384", "#36A2EB", "#FFCE56"]

const Dashboard = () => {
  const navigate = useNavigate()

  const { currentUser } = useSelector((state) => state.user)

  const [dashboardData, setDashboardData] = useState([])
  const [pieChartData, setPieChartData] = useState([])
  const [barChartData, setBarChartData] = useState([])

  // prepare data for pie chart
  const prepareChartData = (data) => {
    const taskDistribution = data?.taskDistribution || {}
    const taskPriorityLevels = data?.taskPriorityLevel || {}

    const taskDistributionData = [
      { status: "Pending", count: taskDistribution?.Pending || 0 },
      { status: "In Progress", count: taskDistribution?.InProgress || 0 },
      { status: "Completed", count: taskDistribution?.Completed || 0 },
    ]

    setPieChartData(taskDistributionData)

    const priorityLevelData = [
      { priority: "Low", count: taskPriorityLevels?.Low || 0 },
      { priority: "Medium", count: taskPriorityLevels?.Medium || 0 },
      { priority: "High", count: taskPriorityLevels?.High || 0 },
    ]

    setBarChartData(priorityLevelData)
  }

  const getDashboardData = async () => {
    try {
      const response = await axiosInstance.get("/tasks/dashboard-data")

      if (response.data) {
        setDashboardData(response.data)
        prepareChartData(response.data?.charts || null)
      }
    } catch (error) {
      console.log("Error fetching dashboard data: ", error)
    }
  }

  useEffect(() => {
    getDashboardData()

    return () => { }
  }, [])

  return (


    <DashboardLayout activeMenu={"Dashboard"}>
      <div className="p-6 space-y-8 bg-gray-50 min-h-screen">

        {/* HERO SECTION */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 p-8 text-white shadow-xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h2 className="text-3xl font-bold tracking-wide">
                👋 Welcome back, {currentUser?.name}
              </h2>

              <p className="opacity-90 mt-2 text-sm">
                {moment().format("dddd, Do MMMM YYYY")}
              </p>
            </div>

            <button
              onClick={() => navigate("/admin/create-task")}
              className="bg-white text-indigo-600 font-semibold px-6 py-3 rounded-xl shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-300"
            >
              + Create Task
            </button>
          </div>

          {/* glow effect */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white opacity-10 rounded-full blur-3xl"></div>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Total Tasks",
              value: dashboardData?.charts?.taskDistribution?.All || 0,
              color: "from-blue-500 to-blue-600",
            },
            {
              title: "Pending",
              value: dashboardData?.charts?.taskDistribution?.Pending || 0,
              color: "from-yellow-400 to-orange-500",
            },
            {
              title: "In Progress",
              value:
                dashboardData?.charts?.taskDistribution?.InProgress || 0,
              color: "from-indigo-500 to-purple-600",
            },
            {
              title: "Completed",
              value:
                dashboardData?.charts?.taskDistribution?.Completed || 0,
              color: "from-green-500 to-emerald-600",
            },
          ].map((card, index) => (
            <div
              key={index}
              className={`bg-gradient-to-br ${card.color} text-white p-6 rounded-2xl shadow-lg hover:scale-105 transition duration-300`}
            >
              <p className="text-sm opacity-80">{card.title}</p>
              <h3 className="text-4xl font-bold mt-2">{card.value}</h3>
            </div>
          ))}
        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">
              📊 Task Distribution
            </h3>

            <div className="h-64">
              <CustomPieChart
                data={pieChartData}
                label="Tasks"
                colors={COLORS}
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">
              ⚡ Priority Levels
            </h3>

            <div className="h-64">
              <CustomBarChart data={barChartData} />
            </div>
          </div>
        </div>

        {/* RECENT TASKS */}
        <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            🧾 Recent Tasks
          </h3>

          <RecentTasks tasks={dashboardData?.recentTasks} />
        </div>
      </div>
    </DashboardLayout>

  )
}

export default Dashboard
