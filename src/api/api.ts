import { ParkingMap } from "@/components/Parking/Commons/utils/types";
import { components } from "../../api/schema";
import { HttpMethod } from "@/utils/httpMethod";

export const deleteLendOffer = ({ id }: { id: string }) =>
  fetch(`/api/v1/lend-offer/${id}`, {
    method: HttpMethod.DELETE,
  });

export const createLendOffer = (
  body: components["schemas"]["LendOfferPostForm"]
) =>
  fetch(`/api/v1/lend-offer`, {
    method: HttpMethod.POST,
    body: JSON.stringify(body),
  }).then((response) => response.json());

export const getLendOffers = (body: components["schemas"]["LendOfferDTO"]) => {
  const query = new URLSearchParams(body).toString();
  // const query="owner_id=58c38b13-387c-462b-bf84-20f9bdf2986a&start_date=2027-06-03T13:00:00Z&end_date=2028-06-03T17:00:00Z"
  return fetch(`/api/v1/lend-offer?${query}`, {
    method: HttpMethod.GET,
  });
};

export const getParking = async (parkingId: number): Promise<ParkingMap> => {
  const response = await fetch(`/api/v1/parking/${parkingId}`, {
    method: HttpMethod.GET,
  });
  if (!response.ok) {
    throw new Error("Failed to fetch parking");
  }
  const parkingDto =
    (await response.json()) as components["schemas"]["ParkingDTO"];
  return parkingDto.ui_object as unknown as ParkingMap;
};
