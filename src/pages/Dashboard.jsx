import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useLottie } from "lottie-react";
import animationData from "../assets/todo.json";

export default function Dashboard() {
  const navigate = useNavigate();

  const quotes = [
    "“The secret of getting ahead is getting started.”",
    "“Your future is created by what you do today.”",
    "“Small steps every day lead to big changes.”",
    "“Focus on progress, not perfection.”",
  ];

  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  const options = {
    animationData,
    loop: true,
  };

  const { View } = useLottie(options);

  const handleGoToList = () => {
    navigate("/todo");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-8 py-20 flex flex-col lg:flex-row items-center justify-between gap-16">
        {/* Left Section */}
        <div className="flex-1 space-y-8 text-center lg:text-left">
          <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight">
            Welcome Back to Your Dashboard!
          </h1>
          <p className="text-gray-400 text-2xl italic leading-relaxed">
            {randomQuote}
          </p>

          <button
            onClick={handleGoToList}
            className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-lg text-xl font-semibold transition transform hover:scale-105"
          >
            Go to To-Do List
          </button>
        </div>

        {/* Right Section */}
        <div className="flex-1 flex justify-center">
          <div className="w-[450px] lg:w-[600px] xl:w-[700px]">
            {View}
          </div>
        </div>
      </div>
    </div>
  );
}
