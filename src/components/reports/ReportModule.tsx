import React, { useEffect, useState } from "react";
import Button from "@hui/_atoms/button/Button";

interface iReportModule {
  buttonText?: string;
  children: React.ReactNode;
  hasButton?: boolean;
  headerText: string;
  onClickHandler?: () => void;
}

const ReportModule = ({
  buttonText, 
  children, 
  hasButton = false, 
  headerText, 
  onClickHandler
}:iReportModule) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {  
    if (window.innerWidth < 640) {
      setIsMobile(true);
    }
  }, []);

  return (
    <div className="module">
      <div className="module-header module-header--light">
        <h2 className="module-title">{headerText}</h2>
        {hasButton && <div><Button size={isMobile ? "tiny" : "small"} onClick={onClickHandler}>{buttonText}</Button></div>}
      </div>
      {children}
    </div>
  )};

export default ReportModule;