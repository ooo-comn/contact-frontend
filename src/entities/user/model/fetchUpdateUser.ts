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

  const proxyBody = {
    path: "/contacts/",
    body: requestBody,
    authorization: `tma ${initData}`,
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
    console.log(
      "Response headers:",
      Object.fromEntries([...response.headers.entries()])
    );

    // Try to get the response body as text first
    const responseText = await response.text();
    console.log("Raw response text:", responseText);

    // Then try to parse it as JSON
    let responseData = null;
    try {
      responseData = responseText ? JSON.parse(responseText) : null;
    } catch (jsonError) {
      console.error("Error parsing JSON:", jsonError);
    }

    console.log("fetchUpdateUser response:", {
      status: response.status,
      ok: response.ok,
      data: responseData,
    });

    // If we got a 500 error, something went wrong in the proxy or backend
    if (!response.ok) {
      throw new Error(
        `Server error (${response.status}): ${
          responseText || "No response body"
        }`
      );
    }

    return responseData;
  } catch (error) {
    console.error("fetchUpdateUser error:", error);
    throw error;
  }
};
