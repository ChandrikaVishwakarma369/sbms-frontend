import React from "react";

const StatsCard = ({ title, value, change, icon }) => {
  return (
    <div
      className="relative bg-white rounded-xl shadow-sm p-5 
      flex justify-between items-start 
      hover:shadow-lg transition-all duration-300 group"
    >
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <h2 className="text-3xl font-bold text-[#0F3A53] mt-1">{value}</h2>
        <p className="text-green-500 text-xs mt-2">{change}</p>
      </div>

      <div className="bg-[#0F3A53] text-white p-3 rounded-lg shadow-md">
        {icon}
      </div>

      <span
        className="absolute bottom-0 left-0 w-0 h-[3px] 
        bg-[#0F3A53] group-hover:w-full transition-all duration-300"
      ></span>
    </div>
  );
};

export default StatsCard;
