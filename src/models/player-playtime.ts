export class PlayerPlaytime {
  id: string;
  pvp: {
    general: number;
    ranked: number;
    casual: number;
    custom: number;
    other: number;
  };
  pve: {
    general: number;
  }
}
