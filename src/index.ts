import {
  initFirebase,
  signInToFirebase,
  startReportingPresenceToFirebase,
  signOutOfFirebase,
  updateFirebaseState,
} from "./modules/firebase";
import { config } from "./config/config";
import { monitorSystemInfo } from "./modules/systemInfo";
import { initTerminalState, beginRespondingToTerminalCommands } from "./modules/terminal";

const handleError = (e: any) => {
  console.error(e);
  process.exit(1);
};

async function bootstrap() {
  console.log("starting up..");

  initFirebase();

  console.log(`authenticating..`);

  await signInToFirebase(config.FIREBASE_EMAIL, config.FIREBASE_PASSWORD);

  console.log("authenticated");

  startReportingPresenceToFirebase();

  await initTerminalState();
  beginRespondingToTerminalCommands();

  monitorSystemInfo(
    (allInfo) => updateFirebaseState("cubes", { fullSystemInfoJson: JSON.stringify(allInfo) }),
    (essentialSystemInfo) => updateFirebaseState("cubes", { essentialSystemInfo })
  );

  setInterval(() => {}, 1000);
}

bootstrap().catch(handleError);
