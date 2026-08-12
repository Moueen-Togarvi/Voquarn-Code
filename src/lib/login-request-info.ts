import { getClientIp } from "@/lib/admin-otp";

export type LoginRequestInfo = {
  ipAddress: string;
  device: string;
  deviceType: string;
  operatingSystem: string;
  browser: string;
  location: string;
  coordinates: string;
  timezone: string;
  language: string;
  userAgent: string;
  occurredAt: string;
};

function headerValue(headers: Headers, ...names: string[]) {
  for (const name of names) {
    const value = headers.get(name)?.trim();
    if (value) return value;
  }
  return "";
}

function decodeHeader(value: string) {
  if (!value) return "";
  try {
    return decodeURIComponent(value.replace(/\+/g, " "));
  } catch {
    return value;
  }
}

function detectBrowser(userAgent: string) {
  const browserMatchers: Array<[RegExp, string]> = [
    [/Edg(?:A|iOS)?\/([\d.]+)/, "Microsoft Edge"],
    [/OPR\/([\d.]+)/, "Opera"],
    [/(?:Chrome|CriOS)\/([\d.]+)/, "Google Chrome"],
    [/(?:Firefox|FxiOS)\/([\d.]+)/, "Mozilla Firefox"],
    [/Version\/([\d.]+).*Safari/, "Safari"],
  ];

  for (const [pattern, name] of browserMatchers) {
    const match = userAgent.match(pattern);
    if (match) return `${name} ${match[1]}`;
  }
  return userAgent ? "Unknown browser" : "Unavailable";
}

function detectOperatingSystem(userAgent: string) {
  const windowsVersion = userAgent.match(/Windows NT ([\d.]+)/)?.[1];
  if (windowsVersion) {
    const versions: Record<string, string> = {
      "10.0": "Windows 10/11",
      "6.3": "Windows 8.1",
      "6.2": "Windows 8",
      "6.1": "Windows 7",
    };
    return versions[windowsVersion] || `Windows NT ${windowsVersion}`;
  }

  const android = userAgent.match(/Android ([\d.]+)/)?.[1];
  if (android) return `Android ${android}`;

  const ios = userAgent.match(/(?:iPhone OS|CPU OS) ([\d_]+)/)?.[1];
  if (ios) return `iOS/iPadOS ${ios.replaceAll("_", ".")}`;

  const mac = userAgent.match(/Mac OS X ([\d_]+)/)?.[1];
  if (mac) return `macOS ${mac.replaceAll("_", ".")}`;

  if (/CrOS/.test(userAgent)) return "ChromeOS";
  if (/Linux/.test(userAgent)) return "Linux";
  return userAgent ? "Unknown OS" : "Unavailable";
}

function detectDevice(userAgent: string) {
  const androidModel = userAgent.match(/Android [^;]+; ([^)]+?)(?: Build\/[^)]*)?\)/)?.[1];
  const isBot = /bot|crawler|spider|headless/i.test(userAgent);
  const isTablet = /iPad|Tablet|Android(?!.*Mobile)/i.test(userAgent);
  const isMobile = /Mobile|iPhone|iPod|Android/i.test(userAgent);

  if (isBot) return { device: "Automated client/bot", deviceType: "Bot" };
  if (/iPad/i.test(userAgent)) return { device: "Apple iPad", deviceType: "Tablet" };
  if (/iPhone/i.test(userAgent)) return { device: "Apple iPhone", deviceType: "Mobile" };
  if (androidModel) {
    return {
      device: androidModel.trim(),
      deviceType: isTablet ? "Tablet" : "Mobile",
    };
  }
  if (isTablet) return { device: "Unknown tablet", deviceType: "Tablet" };
  if (isMobile) return { device: "Unknown phone", deviceType: "Mobile" };
  return { device: "Desktop or laptop", deviceType: "Desktop" };
}

export function getLoginRequestInfo(headers: Headers, occurredAt = new Date()): LoginRequestInfo {
  const userAgent = headerValue(headers, "user-agent");
  const city = decodeHeader(headerValue(headers, "x-vercel-ip-city", "cf-ipcity"));
  const region = decodeHeader(
    headerValue(headers, "x-vercel-ip-country-region", "cf-region"),
  );
  const country = headerValue(headers, "x-vercel-ip-country", "cf-ipcountry");
  const postalCode = headerValue(headers, "x-vercel-ip-postal-code", "cf-postal-code");
  const latitude = headerValue(headers, "x-vercel-ip-latitude", "cf-iplatitude");
  const longitude = headerValue(headers, "x-vercel-ip-longitude", "cf-iplongitude");
  const timezone = decodeHeader(
    headerValue(headers, "x-vercel-ip-timezone", "cf-timezone"),
  );
  const locationParts = [city, region, country, postalCode].filter(Boolean);
  const device = detectDevice(userAgent);

  return {
    ipAddress: getClientIp(headers),
    device: device.device,
    deviceType: device.deviceType,
    operatingSystem: detectOperatingSystem(userAgent),
    browser: detectBrowser(userAgent),
    location: locationParts.length > 0 ? locationParts.join(", ") : "Unavailable",
    coordinates: latitude && longitude ? `${latitude}, ${longitude}` : "Unavailable",
    timezone: timezone || "Unavailable",
    language: headerValue(headers, "accept-language") || "Unavailable",
    userAgent: userAgent || "Unavailable",
    occurredAt: new Intl.DateTimeFormat("en-PK", {
      dateStyle: "full",
      timeStyle: "long",
      timeZone: "Asia/Karachi",
    }).format(occurredAt),
  };
}
