export const getVisitorId = () => {
  let visitorId = localStorage.getItem("visitorId");

  if (!visitorId) {
    visitorId =
      "visitor-" +
      Date.now() +
      "-" +
      Math.random().toString(36).substring(2, 15);

    localStorage.setItem("visitorId", visitorId);
  }

  return visitorId;
};