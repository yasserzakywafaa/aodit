import { Auth, google, webmasters_v3 } from "googleapis";

import CONFIG from "../config";

export interface GoogleIndexingParams {
  url: string;
  clientEmail: string;
  privateKey: string;
  propertyUrl: string;
  dryRun?: boolean;
  type?: "URL_UPDATED" | "URL_REMOVED";
}

const credentials = {
  type: CONFIG.GOOGLE_TYPE,
  project_id: CONFIG.GOOGLE_PROJECT_ID,
  private_key_id: CONFIG.GOOGLE_PRIVATE_KEY_ID,
  private_key: CONFIG.GOOGLE_PRIVATE_KEY,
  client_email: CONFIG.GOOGLE_CLIENT_EMAIL,
  client_id: CONFIG.GOOGLE_CLIENT_ID,
  //   auth_uri: CONFIG.GOOGLE_AUTH_URI,
  //   token_uri: CONFIG.GOOGLE_TOKEN_URI,
  //   auth_provider_x509_cert_url: CONFIG.GOOGLE_AUTH_PROVIDER_CERT_URL,
  //   client_x509_cert_url: CONFIG.GOOGLE_CLIENT_CERT_URL,
  universe_domain: CONFIG.GOOGLE_UNIVERSE_DOMAIN,
};

export const handleSubmitSitemapToGoogle = async (siteMapFileName: string) => {
  // Initialize authentication
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/webmasters"],
  });

  // Create client instance
  const client: Auth.JWT = (await auth.getClient()) as Auth.JWT;
  if (!(client instanceof google.auth.JWT)) {
    throw new Error("❌ Unexpected authentication client type!");
  }

  // Configure the Search Console API
  const webmasters: webmasters_v3.Webmasters = google.webmasters({
    version: "v3",
    auth: client,
  });

  // Specify your site URL (as registered in Search Console)
  const siteUrl = "sc-domain:metriz.ai"; // Ensure this matches exactly
  const sitemapUrl = `${CONFIG.APP_URL}/${siteMapFileName}`; // Full URL of your sitemap

  console.log(`🛠️  Submitting "${siteMapFileName}"  🛠️`);

  try {
    // Submit the sitemap
    await webmasters.sitemaps.submit({
      siteUrl: siteUrl,
      feedpath: sitemapUrl,
    });
    console.log(`✅ Sitemap "${siteMapFileName}" file submitted successfully!`);
  } catch (error) {
    if (error instanceof Error) {
      console.error(
        `❌ Error submitting sitemap "${siteMapFileName}" file:`,
        error.message
      );
      if (error.message.includes("Permission denied")) {
        console.error("❌ Verify service account has Search Console ownership");
      }
    } else {
      console.error("❌ Unknown error:", error);
    }
  }
};
// Google Search Console indexing function
export const handleSendIndexingRequestToGoogleSearchConsole = async ({
  url,
  clientEmail,
  privateKey,
  propertyUrl,
  dryRun = false,
  type = "URL_UPDATED",
}: GoogleIndexingParams): Promise<boolean> => {
  const decodedUrl = decodeURIComponent(url);
  try {
    // Check if Google Search Console credentials are configured
    if (!clientEmail || !privateKey || !propertyUrl) {
      console.log(
        "⚠️ Google Search Console credentials not configured, skipping indexing request"
      );
      return false;
    }

    // Create JWT client for Google Search Console API
    const auth = new google.auth.JWT(clientEmail, undefined, privateKey, [
      "https://www.googleapis.com/auth/indexing",
    ]);

    // Validate credentials
    await auth.authorize();

    // Global/ENV dry-run guard
    if (dryRun || CONFIG.IS_DEV) {
      console.log("🧪 Dry-run: would publish indexing notification", {
        url: decodedUrl,
        type,
      });
      return false;
    }

    const indexing = google.indexing({ version: "v3", auth });
    console.log(`🔍 Sending indexing request for: ${decodedUrl}`);

    const response = await indexing.urlNotifications.publish({
      requestBody: {
        url: decodedUrl,
        type,
      },
    });

    console.log(`✅ Indexing request sent successfully for ${decodedUrl}:`, {
      urlNotificationMetadata: response.data.urlNotificationMetadata,
    });

    return true;
  } catch (error) {
    console.error(
      `❌ Error sending indexing request for ${decodedUrl}:`,
      error
    );
    throw error;
  }
};
