export const minimizeAddress = (address: string) =>
  address.substr(0, 6) + '...' + address.substr(-4);
