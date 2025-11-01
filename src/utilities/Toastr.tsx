import React from "react";
import { createRoot } from "react-dom/client";
import Toastr from "../components/toastr/Toastr";

const mountComponent = (type: string, message: string) => {
  // Create target to attach component to DOM
  let mountingPoint = document.querySelector(".toastr-mount");
  if (!mountingPoint) {
    mountingPoint = document.createElement("div");
    mountingPoint.className = "toastr-mount";
    document.body.append(mountingPoint);
    const root = createRoot(mountingPoint);
    root.render(<Toastr {...{ type, message, root }} />);
  } else {
    mountingPoint.parentElement.removeChild(mountingPoint);
    mountComponent(type, message);
  }
};

window.toastr = {
  success: (message) => mountComponent("success", message),
  error: (message) => mountComponent("error", message),
  warning: (message) => mountComponent("warning", message),
  info: (message) => mountComponent("info", message),
};
