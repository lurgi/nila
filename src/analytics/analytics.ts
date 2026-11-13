// Keep the browser contract in sync with the Nila marketing site.
export const ANALYTICS_CHOICE = {
  ALLOWED: "allowed",
  DENIED: "denied",
  UNSET: "unset",
} as const;

export type AnalyticsChoice =
  (typeof ANALYTICS_CHOICE)[keyof typeof ANALYTICS_CHOICE];

type AnalyticsPage = Readonly<{
  path: string;
  title: string;
  // Identifies a screen locally without sending resource IDs to Google.
  key: string;
}>;

const CONTAINER_ID = "GTM-WCR6CH4S";
// Set to the existing GA4 web stream's public G-… ID to enable collection.
const MEASUREMENT_ID: string | null = null;
const CHOICE_COOKIE = "nila_analytics_consent";
const COOKIE_SCOPE = "Domain=nila.im; Path=/; Secure; SameSite=Lax";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 180;
const deniedStorage = {
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
  analytics_storage: "denied",
} as const;

type TagWindow = Window & {
  dataLayer?: unknown[];
};

export function createAnalytics(host: string) {
  const browser: TagWindow = window;
  const enabled =
    browser.location.protocol === "https:" &&
    browser.location.hostname === host &&
    /^G-[A-Z0-9]+$/.test(MEASUREMENT_ID ?? "");

  function disableCollection(disabled: boolean) {
    Reflect.set(browser, `ga-disable-${MEASUREMENT_ID}`, disabled);
  }
  let container: HTMLScriptElement | undefined;
  let currentPage: AnalyticsPage | null = null;
  let lastPageKey: string | undefined;
  let lastPageLocation: string | undefined;
  let entryReferrer = referrerOrigin(document.referrer);

  function getChoice(): AnalyticsChoice {
    const value = document.cookie
      .split(";")
      .map((cookie) => cookie.trim())
      .find((cookie) => cookie.startsWith(`${CHOICE_COOKIE}=`))
      ?.slice(CHOICE_COOKIE.length + 1);

    if (
      value === ANALYTICS_CHOICE.ALLOWED ||
      value === ANALYTICS_CHOICE.DENIED
    ) {
      return value;
    }
    return ANALYTICS_CHOICE.UNSET;
  }

  function setChoice(choice: Exclude<AnalyticsChoice, "unset">): void {
    if (!enabled) return;
    const wasAllowed = getChoice() === ANALYTICS_CHOICE.ALLOWED;
    if (choice === ANALYTICS_CHOICE.DENIED) disableCollection(true);
    writeCookie(
      `${CHOICE_COOKIE}=${choice}; Max-Age=${COOKIE_MAX_AGE}; ${COOKIE_SCOPE}`,
    );

    if (choice === ANALYTICS_CHOICE.DENIED) {
      clearAnalyticsCookies();
      if (wasAllowed || container) browser.location.reload();
      return;
    }
    collect();
  }

  function setPage(page: AnalyticsPage | null): void {
    if (!enabled) return;
    currentPage = page;
    if (!page) {
      disableCollection(true);
      lastPageKey = undefined;
      lastPageLocation = undefined;
      entryReferrer = "";
      return;
    }
    collect();
  }

  function collect(): void {
    if (!currentPage || getChoice() !== ANALYTICS_CHOICE.ALLOWED) return;
    disableCollection(false);
    if (currentPage.key === lastPageKey) return;

    const parameters = {
      page_location: browser.location.origin + currentPage.path,
      page_referrer: lastPageLocation ?? entryReferrer,
      page_title: currentPage.title,
    };
    lastPageKey = currentPage.key;
    lastPageLocation = parameters.page_location;

    browser.dataLayer ??= [];
    const dataLayer = browser.dataLayer;
    function gtag(..._args: unknown[]): void {
      // biome-ignore lint/complexity/noArguments: Google tag commands use the Arguments object.
      dataLayer.push(arguments);
    }

    if (!container) {
      gtag("consent", "default", deniedStorage);
      gtag("consent", "update", {
        ...deniedStorage,
        analytics_storage: "granted",
      });
    }
    gtag("set", parameters);
    if (!container) {
      dataLayer.push(parameters, { "gtm.start": Date.now(), event: "gtm.js" });
      container = document.createElement("script");
      container.async = true;
      container.referrerPolicy = "origin";
      container.src = `https://www.googletagmanager.com/gtm.js?id=${CONTAINER_ID}`;
      document.head.append(container);
    }
    dataLayer.push({ event: "nila_page_view", ...parameters });
  }

  function refresh(restored = false): void {
    if (!enabled) return;
    if (container && getChoice() !== ANALYTICS_CHOICE.ALLOWED) {
      disableCollection(true);
      clearAnalyticsCookies();
      browser.location.reload();
      return;
    }
    if (restored) {
      lastPageKey = undefined;
      lastPageLocation = undefined;
    }
    collect();
  }

  function watchChoice(
    onChoice: (choice: AnalyticsChoice) => void,
  ): () => void {
    if (!enabled) return () => {};

    function refreshChoice() {
      refresh();
      onChoice(getChoice());
    }

    function onPageShow(event: PageTransitionEvent) {
      if (event.persisted) refresh(true);
      onChoice(getChoice());
    }

    browser.addEventListener("pageshow", onPageShow);
    browser.addEventListener("focus", refreshChoice);
    document.addEventListener("visibilitychange", refreshChoice);
    const cookieStore = browser.cookieStore;
    function onCookiesChanged(event: CookieChangeEvent) {
      if (
        [...event.changed, ...event.deleted].some(
          ({ name }) => name === CHOICE_COOKIE,
        )
      ) {
        refreshChoice();
      }
    }
    cookieStore?.addEventListener("change", onCookiesChanged);
    return () => {
      browser.removeEventListener("pageshow", onPageShow);
      browser.removeEventListener("focus", refreshChoice);
      document.removeEventListener("visibilitychange", refreshChoice);
      cookieStore?.removeEventListener("change", onCookiesChanged);
    };
  }

  return { enabled, getChoice, setChoice, setPage, watchChoice };
}

function referrerOrigin(referrer: string): string {
  if (!referrer) return "";
  try {
    const url = new URL(referrer);
    if (url.protocol === "https:" || url.protocol === "http:")
      return url.origin;
  } catch {
    // An invalid or opaque referrer should not be sent.
  }
  return "";
}

function clearAnalyticsCookies(): void {
  for (const cookie of document.cookie.split(";")) {
    const name = cookie.trim().split("=")[0];
    if (!name || !/^_ga(?:_[A-Za-z0-9_]+)?$/.test(name)) continue;
    writeCookie(`${name}=; Max-Age=0; ${COOKIE_SCOPE}`);
    writeCookie(`${name}=; Max-Age=0; Path=/; Secure; SameSite=Lax`);
  }
}

function writeCookie(value: string): void {
  // biome-ignore lint/suspicious/noDocumentCookie: A synchronous write is needed before reload, including browsers without Cookie Store.
  document.cookie = value;
}
