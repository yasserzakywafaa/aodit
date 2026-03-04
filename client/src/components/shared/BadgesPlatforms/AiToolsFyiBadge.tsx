import { Link } from "@mui/material";

const AiToolsFyiBadge = () => {
  return (
    <Link
      href="https://aitools.fyi/aodit?utm_source=aodit_embed"
      target="_blank"
      sx={{
        display: "flex",
        justifyContent: "center",
        maxWidth: "100%",
      }}
    >
      <img
        src="https://aitools.fyi/api/tool-embed/14501"
        alt=""
        style={{
          width: "100%",
          height: "40px",
          margin: "auto",
        }}
      />
    </Link>
  );
};

export default AiToolsFyiBadge;
