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
  quotes?: {
    USD: {
      price: number;
      volume_24h: number;
      market_cap: number;
      percent_change_24h: number;
    };
  };
  tags?: Tags[];
}

export interface formRegisterData {
  full_name: string;
  username: string;
  email: string;
  password: string;
}

export interface Asset {
  id: number;
  crypto_id: string;
  name: string;
  symbol: string;
  amount: number;
  logo: string;
  total_value_usd: number;
  percent_change_24h: number;
}

export interface PortfolioData {
  cash: number;
  assets: Asset[];
}
