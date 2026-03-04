export const getClientIdFromGoogleAnalyticsCookie = () => {
  const gaCookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("_ga="));

  if (gaCookie) {
    const cookieParts = gaCookie.split(".");
    const clientId = `${cookieParts[2]}.${cookieParts[3]}`; // Extract the Client ID

    return clientId;
  } else {
    console.log("📊 Google Analytics: '_ga' cookie not found! 😔");

    return null;
  }
};
