import { API_BASE_URL, PROXY_URL } from "../../../shared/config/api";

// Helper function to extract user ID from Telegram init data
const extractTelegramId = (initData: string): number => {
  if (initData === "present") {
    return 1054927360; // Default telegram ID for testing when using 'present'
  }

  try {
    // Parse URL-encoded parameters from the initData string
    const params = new URLSearchParams(initData);
    const userDataStr = params.get("user");

    if (userDataStr) {
      const userData = JSON.parse(decodeURIComponent(userDataStr));
      if (userData && userData.id) {
        return userData.id; // Return the Telegram user ID
      }
    }
  } catch (error) {
    console.error("Error extracting Telegram ID:", error);
  }

  // Default fallback
  return 0;
};

export const fetchUpdateUser = async (
  selectedOptions: string[],
  workTypes: string[],
  initData: string,
  userId: number
) => {
  // Extract the Telegram ID from the initData
  const telegramId = extractTelegramId(initData);

  console.log("Using Telegram ID:", telegramId, "instead of user ID:", userId);

  const requestBody = {
    user_id: telegramId, // Use telegram ID here instead of userId
    subjects: selectedOptions,
    work_types: workTypes,
  };

  // Format the authorization correctly for the backend
  const authHeader = initData === "present" ? "tma present" : initData; // In production, pass the raw initData

  const proxyBody = {
    path: "/contacts/",
    body: requestBody,
    authorization: authHeader,
  };

  console.log("fetchUpdateUser request:", {
    endpoint: `${API_BASE_URL}/contacts/`,
    body: requestBody,
    telegramId: telegramId,
    subjects: selectedOptions,
    workTypes: workTypes,
  });

  console.log("Proxy request body:", proxyBody);

  try {
    // Use proxy endpoint instead of direct API call
    const response = await fetch(PROXY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(proxyBody),
    });

    console.log(
      "Response status:",
      response.status,
      "Status text:",
      response.statusText
    );

    // Create a properly typed header object
    const responseHeaders: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });
    console.log("Response headers:", responseHeaders);

    // Get the raw text first for debugging
    const responseText = await response.text();
    console.log("Raw response text:", responseText);

    let responseData;
    try {
      // Try to parse as JSON if possible
      responseData = responseText ? JSON.parse(responseText) : null;
    } catch (e) {
      console.error("Error parsing response JSON:", e);
      responseData = {
        error: "Failed to parse JSON response",
        rawResponse: responseText,
      };
    }

    const result = {
      status: response.status,
      ok: response.ok,
      data: responseData,
    };

    console.log("fetchUpdateUser response:", result);

    if (!response.ok) {
      let errorMessage = "Server error";
      if (responseData && responseData.error) {
        errorMessage = `${errorMessage}: ${responseData.error}`;
      }
      if (responseData && responseData.details) {
        errorMessage = `${errorMessage} - ${responseData.details}`;
      }

      console.error("fetchUpdateUser error:", new Error(errorMessage));
      throw new Error(
        `Server error (${response.status}): ${JSON.stringify(responseData)}`
      );
    }

    return result;
  } catch (error) {
    console.error("fetchUpdateUser error:", error);
    throw error;
  }
};
