import { API_BASE_URL, PROXY_URL } from "../../../shared/config/api";

export const fetchUpdateUser = async (
  selectedOptions: string[],
  workTypes: string[],
  initData: string,
  userId: number
) => {
  const requestBody = {
    user_id: userId,
    subjects: selectedOptions,
    work_types: workTypes,
  };

  // Format the authorization correctly
  // If initData is 'present', we're in development mode
  const authHeader = initData === "present" ? "tma present" : initData; // In production, just pass the raw initData as is

  const proxyBody = {
    path: "/contacts/",
    body: requestBody,
    authorization: authHeader,
  };

  console.log("fetchUpdateUser request:", {
    endpoint: `${API_BASE_URL}/contacts/`,
    body: requestBody,
    userId: userId,
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
