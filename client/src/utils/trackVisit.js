import axios from "axios";
import { getVisitorId } from "./visitorId";

export const trackVisit = async (path) => {
  try {
    const visitorId = getVisitorId();

    await axios.post("/api/v1/analytics/visit", {
      visitorId,
      path,
    });
  } catch (error) {
    console.log("Visit tracking error:", error);
  }
};