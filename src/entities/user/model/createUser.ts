import { API_BASE_URL } from "../../../shared/config/api";

export const createUser = async (userId: number): Promise<boolean> => {
  try {
    console.log(`Creating user with ID: ${userId}`);

    const response = await fetch(`${API_BASE_URL}/users/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `tma ${window.Telegram.WebApp.initData}`,
      },
      body: JSON.stringify({
        user_id: userId,
      }),
    });

    console.log(`Create user response status: ${response.status}`);

    if (response.ok) {
      const result = await response.json();
      console.log("User created successfully:", result);
      return true;
    } else {
      const errorText = await response.text();
      console.error("Error creating user:", errorText);
      return false;
    }
  } catch (error) {
    console.error("Error creating user:", error);
    return false;
  }
};

export const checkUserExists = async (userId: number): Promise<boolean> => {
  try {
    console.log(`Checking if user exists with ID: ${userId}`);

    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `tma ${window.Telegram.WebApp.initData}`,
      },
    });

    console.log(`Check user response status: ${response.status}`);

    if (response.ok) {
      console.log("User exists");
      return true;
    } else if (response.status === 404) {
      console.log("User does not exist");
      return false;
    } else {
      console.error("Error checking user:", response.status);
      return false;
    }
  } catch (error) {
    console.error("Error checking user:", error);
    return false;
  }
};

export const initializeUser = async (): Promise<boolean> => {
  try {
    const userId = window.Telegram.WebApp.initDataUnsafe.user?.id;

    if (!userId) {
      console.error("No user ID found in Telegram data");
      return false;
    }

    console.log(`Initializing user with ID: ${userId}`);

    // Проверяем, существует ли пользователь
    const userExists = await checkUserExists(userId);

    if (!userExists) {
      // Если пользователя нет, создаем его
      console.log("User does not exist, creating...");
      const created = await createUser(userId);

      if (created) {
        console.log("User initialization completed successfully");
        return true;
      } else {
        console.error("Failed to create user");
        return false;
      }
    } else {
      console.log("User already exists, initialization complete");
      return true;
    }
  } catch (error) {
    console.error("Error during user initialization:", error);
    return false;
  }
};
