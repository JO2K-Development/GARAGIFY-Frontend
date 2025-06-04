import { ParkingMap } from "@/components/Parking/Commons/utils/types";
import { components } from "../../api/schema";
import { HttpMethod } from "@/utils/httpMethod";

export const deleteLendOffer = ({ id }: { id: string }) =>
  fetch(`/api/v1/lend-offer/${ id }`, {
    method: HttpMethod.DELETE,
  });

export const createLendOffer = (
  body: components["schemas"]["LendOfferPostForm"]
) =>
  fetch(`/api/v1/lend-offer`, {
    method: HttpMethod.POST,
    body: JSON.stringify(body),
  }).then((response) => response.json());

export const getParking = async (parkingId: number): Promise<ParkingMap> => {
  const response = await fetch(`/api/v1/parkings/${ parkingId }`, {
    method: HttpMethod.GET,
  });
  if (!response.ok) {
    throw new Error("Failed to fetch parking");
  }
  const parkingDto =
    (await response.json()) as components["schemas"]["ParkingDTO"];
  return parkingDto.ui_object as unknown as ParkingMap;
};

export const getLendings = async () => {
  const response = await fetch(`/api/v1/lend/mine`, { method: HttpMethod.GET })
  if (!response.ok) {
    throw new Error("Failed to fetch lend offers");
  }
  return response.json().content;
};

export const getBorrowings = async () => {
  const response = await fetch(`/api/v1/borrow/mine`, { method: HttpMethod.GET })
  if (!response.ok) {
    throw new Error("Failed to fetch lend offers");
  }
  return response;
};

export const deleteBorrowing = (id: string) =>
  fetch(`/api/v1/borrow/${ id }`, {
    method: HttpMethod.DELETE,
  });

