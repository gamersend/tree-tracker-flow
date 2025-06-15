
import React from "react";
import Header from "./Header";
import { ThemeSwitcher } from "../theme/ThemeSwitcher";
import AIHeaderButton from "../ai/AIHeaderButton";
import { useIsMobile } from "@/hooks/use-mobile";
import PwaInstallButton from "../pwa/PwaInstallButton";

const HeaderWrapper: React.FC = () => {
  const isMobile = useIsMobile();

  return (
    <Header>
      <div className="flex items-center gap-2">
        <PwaInstallButton />
        <AIHeaderButton />
        <ThemeSwitcher variant={isMobile ? "icon" : "default"} />
      </div>
    </Header>
  );
};

export default HeaderWrapper;
