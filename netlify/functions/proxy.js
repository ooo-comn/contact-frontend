const fetch = require("node-fetch");

exports.handler = async function (event, context) {
  // Add CORS headers to all responses
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, X-Telegram-Init-Data",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  };

  // Handle OPTIONS preflight request
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: "",
    };
  }

  // Only allow POST requests (after OPTIONS)
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  try {
    const { path, body, authorization } = JSON.parse(event.body);

    const url = `https://comncontact.ru${path}`;
    console.log("Proxy request to:", url);

    // Create headers for the proxied request
    const headers = {
      "Content-Type": "application/json",
    };

    // If authorization was passed, use it as X-Telegram-Init-Data header instead
    // This may be more compatible with backend expectations
    if (authorization) {
      if (authorization.startsWith("tma ")) {
        // Extract the actual data part if it starts with 'tma '
        headers["X-Telegram-Init-Data"] = authorization.substring(4);
      } else {
        // Otherwise use as-is
        headers["X-Telegram-Init-Data"] = authorization;
      }
      console.log("Using Telegram header instead of Authorization");
    }

    // Log some debugging info about the request
    console.log("Request headers:", JSON.stringify(headers));
    console.log("Request body:", JSON.stringify(body));

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body),
      });

      console.log("Response status:", response.status);

      // Check if we got a successful response
      if (response.status >= 200 && response.status < 300) {
        // Try to get response as text first
        const text = await response.text();
        console.log("Raw response text length:", text.length);

        let data;
        if (text.trim()) {
          try {
            data = JSON.parse(text);
          } catch (jsonError) {
            console.error("JSON parsing error:", jsonError.message);
            // Return the raw text if we can't parse JSON
            return {
              statusCode: 200,
              headers: corsHeaders,
              body: JSON.stringify({
                rawResponse: text,
                parseError: jsonError.message,
              }),
            };
          }
        } else {
          // Empty response
          data = { message: "Empty response from server" };
        }

        // Return the successfully parsed data
        return {
          statusCode: response.status,
          headers: corsHeaders,
          body: JSON.stringify(data),
        };
      } else {
        // Error response from the target API
        const errorText = await response.text();
        console.log("Error response text:", errorText);

        return {
          statusCode: response.status,
          headers: corsHeaders,
          body: JSON.stringify({
            error: `API returned ${response.status}`,
            details: errorText,
          }),
        };
      }
    } catch (fetchError) {
      console.error("Fetch error:", fetchError.message);
      return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({
          error: "Failed to communicate with API server",
          message: fetchError.message,
        }),
      };
    }
  } catch (error) {
    console.error("Proxy error:", error.message);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        error: "Internal proxy error",
        message: error.message,
      }),
    };
  }
};
