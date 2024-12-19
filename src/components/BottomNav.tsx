import React from "react";
import { FaUser } from "react-icons/fa";
import { IoMdHome } from "react-icons/io";

export const BottomNav = () => {
   return (
      <div className="btm-nav bg-slate-700">
         <button className="py-4">
            <IoMdHome size={24} color={`gray`} />
         </button>
         <button className="py-4">
            <FaUser size={21} color={`gray`} />
         </button>
      </div>
   );
};
