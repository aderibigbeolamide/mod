export const EPropertyType = {
  house: "HOUSE",
  condo: "CONDO",
  townhouse: "TOWNHOUSE",
  flat: "FLAT",
  bungalow: "BUNGALOW",
  selfCon: "SELFCON",
  services: "SERVICES",
  shared: "SHARED",
  duplex: "DUPLEX",
  studio: "STUDIO",
};
export type EPropertyType = (typeof EPropertyType)[keyof typeof EPropertyType];
