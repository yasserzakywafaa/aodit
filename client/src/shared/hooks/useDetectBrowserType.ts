export enum BrowsersEnum {
  Chrome = "Chrome",
  Opera = "Opera",
  OPR = "OPR",
  Safari = "Safari",
  Edge = "Edg",
  Firefox = "Firefox",
  MSIE = "MSIE",
}

export interface BrowsersType {
  Chrome: boolean;
  Opera: boolean;
  OPR: boolean;
  Safari: boolean;
  Edge: boolean;
  Firefox: boolean;
  MSIE: boolean;
}

export const useDetectBrowserType = () => {
  const BROWSER: BrowsersType = {
    Chrome: false,
    Opera: false,
    OPR: false,
    Safari: false,
    Edge: false,
    Firefox: false,
    MSIE: false,
  };
  const userAgent = window.navigator.userAgent.toLowerCase();

  const hasIndex = (args: string) =>
    userAgent.indexOf(args.toLowerCase()) !== -1;

  // Detects if device is in standalone mode
  const isInStandaloneMode = Boolean(
    "standalone" in window.navigator && window.navigator.standalone
  );

  // Detects if device is on iOS
  const isIos = /iphone|ipad|ipod/.test(userAgent);
  const isMacOs = /macintosh|mac os X/.test(userAgent) && !isIos;
  const isWindows = /windows/.test(userAgent);
  const isAndroid = /android/.test(userAgent);

  switch (true) {
    case hasIndex(BrowsersEnum.Opera):
      BROWSER.Opera = true;
      break;
    case hasIndex(BrowsersEnum.Edge):
      BROWSER.Edge = true;
      break;
    case hasIndex(BrowsersEnum.Chrome):
      BROWSER.Chrome = true;
      break;
    case hasIndex(BrowsersEnum.Safari):
      BROWSER.Safari = true;
      break;
    case hasIndex(BrowsersEnum.Firefox):
      BROWSER.Firefox = true;
      break;
    case hasIndex(BrowsersEnum.MSIE):
      BROWSER.MSIE = true;
      break;
    default:
      break;
  }

  return { BROWSER, isInStandaloneMode, isAndroid, isIos, isMacOs, isWindows };
};
