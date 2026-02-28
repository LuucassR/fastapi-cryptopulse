export interface Tags {
  id: string;
  name: string;
  coin_counter: number;
  ico_counter: number;
}

export interface Coins {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_new: boolean;
  is_active: boolean;
  type: string;
}

export interface Coin {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_new: boolean;
  is_active: boolean;
  type: string;
  logo: string;
  description: string;
  tags: Tags[];
}
