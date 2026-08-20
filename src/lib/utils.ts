export function formatImageUrl(url: string): string {
  if (!url) return '';
  try {
    const fileMatch = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
    if (fileMatch && fileMatch[1]) {
      return `https://lh3.googleusercontent.com/d/${fileMatch[1]}`;
    }
    const openMatch = url.match(/drive\.google\.com\/open\?id=([^&]+)/);
    if (openMatch && openMatch[1]) {
      return `https://lh3.googleusercontent.com/d/${openMatch[1]}`;
    }
    const ucMatch = url.match(/drive\.google\.com\/uc\?.*id=([^&]+)/);
    if (ucMatch && ucMatch[1]) {
      return `https://lh3.googleusercontent.com/d/${ucMatch[1]}`;
    }
  } catch (e) {
    // ignore
  }
  return url;
}
