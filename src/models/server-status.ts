export class PC {
  "AppID ": string;
  MDM: string;
  SpaceID: string;
  Category: string;
  Name: string;
  Platform: string;
  Status: string;
  Maintenance: string | null;
  ImpactedFeatures: any[];
}

export class ServerStatus {
  PC: PC;
  PS4: PC;
  XBOX: PC;
}
