const FEE_TIERS = {
  low: 1,
  average: 1.4,
  high: 2
};

module.exports = fees => {
  if (fees && typeof fees == 'number' && fees > 0)
    return `--gas 300000 \\
      --fees ${fees}$DENOM`;

  return `--gas 300000 \\
    --gas-prices $AVERAGE_GAS_PRICE$DENOM \\
    --gas-adjustment ${fees && typeof fees == 'string' && FEE_TIERS[fees] ? FEE_TIERS[fees] : FEE_TIERS.average}`;
};