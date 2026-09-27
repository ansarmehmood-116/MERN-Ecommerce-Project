import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackVisit } from "../utils/trackVisit";

const VisitTracker = () => {
  const location = useLocation();

  useEffect(() => {
    trackVisit(location.pathname);
  }, [location.pathname]);

  return null;
};

export default VisitTracker;