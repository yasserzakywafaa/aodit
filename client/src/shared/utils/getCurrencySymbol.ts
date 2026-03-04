export const getCurrencySymbol = (currency: string | undefined) => {
    switch (currency) {
        case "eur":
          return "€";
        case "usd":
          return "$";
        case "CHF":
          return "₣";
        default:
          return "€";
      }
}