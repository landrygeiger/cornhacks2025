import { FC, useCallback } from "react";
import { requestDeviceOrientationPermission } from "../utils/orientation";

type Props = {
  onAppInitialized: () => void;
};

const Landing: FC<Props> = ({ onAppInitialized }) => {
  const initializeApp = useCallback(async () => {
    const isSuccessful = await requestDeviceOrientationPermission(
      console.error
    );
    if (isSuccessful) onAppInitialized();
  }, [onAppInitialized]);

  return (
    <div className="h-full flex align-middle justify-center">
      <button onClick={initializeApp}>Start</button>
    </div>
  );
};

export default Landing;
