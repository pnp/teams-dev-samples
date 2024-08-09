import { useContext } from "react";
import { TeamsFxContext } from "./Context";
import { EnsureSiteUser } from "./sample/EnsureSiteUser";

export default function Tab() {
  const { themeString } = useContext(TeamsFxContext);
  return (
    <div
      className={themeString === "default" ? "light" : themeString === "dark" ? "dark" : "contrast"}
    >
      <EnsureSiteUser />
    </div>
  );
}
