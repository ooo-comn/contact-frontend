import { API_BASE_URL } from "../../../shared/config/api";

export const fetchUpdateUser = async (
  selectedOptions: string[],
  workTypes: string[],
  initData: string,
  userId: number
) => {
  await fetch(`${API_BASE_URL}/contacts/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `tma ${initData}`,
    },
    body: JSON.stringify({
      user_id: userId,
      subjects: selectedOptions,
      work_types: workTypes,
    }),
  });
};
