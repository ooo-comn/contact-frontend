const fetch = require("node-fetch");

exports.handler = async function (event, context) {
  // Add CORS headers to all responses
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
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
    console.log("Request body:", body);

    // Handle Telegram Mini App authorization format
    // The format is: "tma <initData>"
    console.log(
      "Authorization header received:",
      authorization ? "Present" : "Missing"
    );

    // Create headers for the proxied request
    const headers = {
      "Content-Type": "application/json",
    };

    // If authorization was passed, forward it exactly as is
    if (authorization) {
      headers["Authorization"] = authorization;
    }

    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(body),
    });

    console.log("Response status:", response.status);

    // Parse response body
    let data;
    try {
      const text = await response.text();
      console.log("Raw response text:", text);

      try {
        data = text ? JSON.parse(text) : null;
        console.log("Parsed response data:", data);
      } catch (jsonError) {
        console.error("JSON parsing error:", jsonError);
        return {
          statusCode: response.status,
          headers: corsHeaders,
          body: JSON.stringify({
            error: "Failed to parse JSON response",
            rawResponse: text,
          }),
        };
      }
    } catch (textError) {
      console.error("Text reading error:", textError);
      return {
        statusCode: response.status,
        headers: corsHeaders,
        body: JSON.stringify({
          error: "Failed to read response text",
          message: textError.message,
        }),
      };
    }

    return {
      statusCode: response.status,
      headers: corsHeaders,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error("Proxy error:", error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        error: error.message,
        stack: error.stack,
      }),
    };
  }
};
