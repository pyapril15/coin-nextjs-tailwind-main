"use client";

import { Toaster } from "react-hot-toast";

const ToasterProvider = () => {
  return (
    <div className="z-99999">
      <Toaster />
    </div>
  );
};

export default ToasterProvider;
