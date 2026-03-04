import {
  createOpenRouterClient,
  handleOpenRouterAIRequest,
  normalizeModelName,
} from "./openRouterClient";

import CONFIG from "../config";

// Constants
const TIMEOUT_REGULAR = 30000; // 30 seconds
const TIMEOUT_ONLINE = 120000; // 120 seconds
const WEB_ANALYZER_SYSTEM_MESSAGE =
  "You are a web content analyzer. Visit websites and extract relevant information for analysis purposes. Provide accurate, detailed information about pricing, features, descriptions, and value propositions.";

export interface UrlFetchResult {
  url: string;
  data: string;
}

export interface FetchUrlDataOptions {
  externalOpenAiApiKey?: string;
  model?: string;
  timeout?: {
    regular?: number;
    online?: number;
  };
}

/**
 * Fetches real-time data from URLs using web browsing capability
 * Uses a paid model with :online suffix to visit websites and extract information
 *
 * @param urls - Array of URLs to fetch data from
 * @param options - Configuration options
 * @returns Map of URL to fetched data
 */
export const handleFetchUrlData = async (
  urls: string[],
  options: FetchUrlDataOptions = {},
): Promise<Map<string, string>> => {
  const hyperlinks = urls.filter((link) => link && link.trim() !== "");
  if (hyperlinks.length === 0) {
    console.log("🔗 No hyperlinks provided, skipping URL data fetch");
    return new Map();
  }

  console.log(`🌐 Fetching data from ${hyperlinks.length} URL(s)...`);

  const model = options.model || CONFIG.OPENROUTER_WEB_BROWSE_MODEL;
  const isOnlineModel = model.includes(":online");
  const timeout = isOnlineModel
    ? options.timeout?.online || TIMEOUT_ONLINE
    : options.timeout?.regular || TIMEOUT_REGULAR;

  const results = await Promise.all(
    hyperlinks.map((url) =>
      handleFetchSingleUrl(url, model, timeout, options.externalOpenAiApiKey),
    ),
  );

  const urlDataMap = new Map(results.map(({ url, data }) => [url, data]));
  console.log(`✅ URL data fetching completed for ${urlDataMap.size} URL(s)`);

  return urlDataMap;
};

const handleFetchSingleUrl = async (
  url: string,
  model: string,
  timeout: number,
  externalOpenAiApiKey?: string,
): Promise<UrlFetchResult> => {
  const fetchPromise = handleWebAnalysisRequest(
    url,
    model,
    externalOpenAiApiKey,
  );
  const timeoutPromise = new Promise<UrlFetchResult>((resolve) => {
    setTimeout(() => {
      console.warn(`⏱️  Timeout fetching data from ${url} (${timeout}ms)`, {
        model,
      });
      resolve({ url, data: `[Timeout fetching data from ${url}]` });
    }, timeout);
  });

  return Promise.race([fetchPromise, timeoutPromise]);
};

const handleWebAnalysisRequest = async (
  url: string,
  model: string,
  externalOpenAiApiKey?: string,
): Promise<UrlFetchResult> => {
  try {
    console.log(`📡 Fetching data from: ${url}`, { model });

    const prompt = `Visit the following website and extract key information:
- Website URL: ${url}
- Extract: pricing information, product/service description, key features, value propositions, and any other relevant details that would help write about this website in a analysis report.
- Format the information in a clear, structured way that can be used as context.

Please provide a comprehensive summary of the website's content, focusing on information that would be useful for creating analysis content about it.`;

    const response = await handleWebRequest(
      model,
      [
        { role: "system" as const, content: WEB_ANALYZER_SYSTEM_MESSAGE },
        { role: "user" as const, content: prompt },
      ],
      externalOpenAiApiKey,
    );

    const fetchedData = response.choices[0]?.message?.content || "";
    console.log(`✅ Successfully fetched data from ${url}`, {
      dataLength: fetchedData.length,
    });

    return { url, data: fetchedData };
  } catch (error: any) {
    console.warn(`❌ Failed to fetch data from ${url}:`, {
      error: error.message,
    });
    return { url, data: `[Unable to fetch data from ${url}]` };
  }
};

const handleWebRequest = async (
  model: string,
  messages: Array<{ role: "system" | "user"; content: string }>,
  externalOpenAiApiKey?: string,
): Promise<any> => {
  if (externalOpenAiApiKey) {
    const openai = createOpenRouterClient(externalOpenAiApiKey);
    return await openai.chat.completions.create({
      model: normalizeModelName(model, true),
      messages,
      max_tokens: CONFIG.AI_MAX_TOKENS.URL_FETCH,
    });
  }

  return await handleOpenRouterAIRequest(model, messages, {
    max_tokens: CONFIG.AI_MAX_TOKENS.URL_FETCH,
  });
};
