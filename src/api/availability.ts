import { HttpMethod } from "@/utils/httpMethod";

export type TimeRangesAvailabilityBody = {
  untilWhen: Date;
};
export const getLendTimeRanges = (
  parkingId: number,
  body: TimeRangesAvailabilityBody
) => {
  const query = new URLSearchParams({
    untilWhen: body.untilWhen.toISOString(),
  }).toString();
  return fetch(`/api/v1/parking/${parkingId}/lend/available-timeranges?${query}`, {
    method: HttpMethod.GET,
  });
};


export type SpotAvailabilityBody = {
  from: Date;
  until:Date;
};
export const getLendSpots = (
  parkingId: number,
  body: SpotAvailabilityBody
) => {
  const query = new URLSearchParams({
    from: body.from.toISOString(),
    until: body.until.toISOString(),
  }).toString();
  return fetch(`/api/v1/parking/${parkingId}/lend/available-spots?${query}`, {
    method: HttpMethod.GET,
  });
};



export const getBorrowTimeRanges = (
  parkingId: number,
  body: TimeRangesAvailabilityBody
) => {
  const query = new URLSearchParams({
    untilWhen: body.untilWhen.toISOString(),
  }).toString();
  return fetch(`/api/v1/parking/${parkingId}/borrow/available-timeranges?${query}`, {
    method: HttpMethod.GET,
  });
};

export const getBorrowSpots = (
  parkingId: number,
  body: SpotAvailabilityBody
) => {
  const query = new URLSearchParams({
    from: body.from.toISOString(),
    until: body.until.toISOString(),
  }).toString();
  return fetch(`/api/v1/parking/${parkingId}/borrow/available-spots?${query}`, {
    method: HttpMethod.GET,
  });
};