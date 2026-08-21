import { Link } from "@mui/material";
import { useAppResolvedThemeMode } from "src/application/hooks/useAppResolvedThemeMode";

const ProductHuntBadge = () => {
  const resolvedThemeMode = useAppResolvedThemeMode();

  const productHuntTheme = resolvedThemeMode === "light" ? "dark" : "neutral";

  return (
    <Link
      href="https://www.producthunt.com/posts/aodit?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-aodit"
      target="_blank"
      sx={{
        display: "flex",
        justifyContent: "center",
        maxWidth: "80%",
      }}
    >
      <img
        src={`https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=955956&theme=${productHuntTheme}&t=1745235398441`}
        alt="Aodit - AI&#0045;Powered&#0032;Project&#0032;Generator | Product Hunt"
        style={{
          width: "100%",
          height: "40px",
          margin: "auto",
        }}
      />
    </Link>
  );
};

export default ProductHuntBadge;
