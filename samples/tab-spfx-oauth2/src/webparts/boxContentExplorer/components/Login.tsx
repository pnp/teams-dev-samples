import * as React from "react";
import { PrimaryButton } from "office-ui-fabric-react";
import { boxService } from "../../../services/services";
import styles from "./BoxContentExplorer.module.scss";
import Loading from "../../../utilities/loading";
const loadingImage: any = require("./assets/loading.gif");

const logo: any = require("./assets/boxLogo.png");

const BoxLogin = () => {
  const [isLoading, setIsLoading] = React.useState(true);

  const openLoginPopUp = async () => {
    setIsLoading(true);
    boxService.GetBoxAccessToken()
    .then(res => setIsLoading(false))
    .catch(err=>setIsLoading(false));
  };

  return (
    <div>
      <Loading imageSrc={loadingImage} hidden={isLoading} />
      <div className={styles.login} hidden={!isLoading}>
        <div className={styles.loginContainer}>
          <img src={logo} alt="Box logo" />
          <p>Please log in to access to this folder</p>
          <PrimaryButton
            className={styles.loginButton}
            text="Log in"
            onClick={openLoginPopUp}
          />
        </div>
      </div>
    </div>
  );
};

export default BoxLogin;
