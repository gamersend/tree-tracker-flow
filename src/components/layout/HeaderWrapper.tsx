
import React from "react";
import Header from "./Header";
import { ThemeSwitcher } from "../theme/ThemeSwitcher";

const HeaderWrapper: React.FC = () => {
  return (
    <div className="relative">
      <Header />
      <div className="absolute right-16 top-4">
        <ThemeSwitcher />
      </div>
    </div>
  );
};

export default HeaderWrapper;
