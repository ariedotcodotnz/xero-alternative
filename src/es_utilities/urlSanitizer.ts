export const urlSanitizer = (url: string): URL | null => {
  try {
    const parsedUrl = new URL(url, window.location.origin);
    const safeProtocols = ["http:", "https:", "mailto:"];
    if (!safeProtocols.includes(parsedUrl.protocol)) {
      return null;
    }
    return parsedUrl;
  } catch (error) {
    return null;
  }
};
