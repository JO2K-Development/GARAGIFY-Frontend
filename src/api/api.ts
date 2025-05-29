import { components } from "../../api/schema";
import { HttpMethod } from "@/utils/httpMethod";

export const deleteLendOffer = ({ id }: { id: string }) =>
  fetch(`/api/v1/lend-offer/${id}`, {
    method: HttpMethod.DELETE,
  });

export const createLendOffer = (body: components["schemas"]["LendOfferPOST"]) =>
  fetch(`/api/v1/lend-offer`, {
    method: HttpMethod.POST,
    body: JSON.stringify(body),
  });

export const getLendOffers = (body: components["schemas"]["LendOfferGET"]) => {
  // const query = new URLSearchParams(body).toString();
  // const query="owner_id=58c38b13-387c-462b-bf84-20f9bdf2986a&start_date=2027-06-03T13:00:00Z&end_date=2028-06-03T17:00:00Z"
  return fetch(`/api/v1/lend-offer?`, {
    method: HttpMethod.GET,
  });
};
