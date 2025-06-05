import { HttpMethod } from "@/utils/httpMethod";
import { Paging } from "./parking";
import { components } from "../../api/schema";

export const getUsers = async ({
  page,
  size,
  sort,
  parkingId,
}: Paging & {
  parkingId: number;
}) => {
  const query = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    ...(sort && { sort }),
  }).toString();
  const response = await fetch(
    `/api/v1/admin/parkings/${parkingId}/users?${query}`,
    {
      method: HttpMethod.GET,
    }
  );

  const data =
    (await response.json()) as components["schemas"]["UserWithSpotsListDTO"];
  return data;
};

export type UserWithSpots = components["schemas"]["UserWithSpotsDTO"];

export const getAllUsers = async (
  parkingId: number,
  sort?: string
): Promise<UserWithSpots[]> => {
  const pageSize = 100; // Adjust as needed based on API limits
  let allUsers: UserWithSpots[] = [];
  let currentPage = 0;
  let totalPages = 1;

  while (currentPage < totalPages) {
    const data = await getUsers({
      page: currentPage,
      size: pageSize,
      sort,
      parkingId,
    });
    allUsers = allUsers.concat(data.content);
    totalPages = data.totalPages;
    currentPage++;
  }

  return allUsers;
};

export const assignUser = async ({
  parkingId,
  spotId,
  user_id,
}: components["schemas"]["AssignParkingSpotFormDTO"] & {
  parkingId: number;
  spotId: string;
}) => {
  await fetch(
    `/api/v1/admin/parkings/${parkingId}/parking-spots/${spotId}/assign`,
    {
      method: HttpMethod.PUT,
      body: JSON.stringify({
        user_id: user_id,
      }),
    }
  ).then((response) =>
  {if (!response.ok) {
    throw new Error(`Error: ${response.status} ${response.statusText}`);
  } return response.json()});
};
