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

  console.log("fetchUpdateUser request:", {
    endpoint: `${API_BASE_URL}/contacts/`,
    body: requestBody,
    userId: userId,
    subjects: selectedOptions,
    workTypes: workTypes,
  });

  try {
    // Use proxy endpoint instead of direct API call
    const response = await fetch(PROXY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        path: "/contacts/",
        body: requestBody,
        authorization: `tma ${initData}`,
      }),
    });

    const responseData = await response.json().catch(() => null);
    console.log("fetchUpdateUser response:", {
      status: response.status,
      ok: response.ok,
      data: responseData,
    });

    return responseData;
  } catch (error) {
    console.error("fetchUpdateUser error:", error);
    throw error;
  }
};
