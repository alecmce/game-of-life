  import { Box, Card, Grid } from "@chakra-ui/react";
import { ReactNode } from "react";
import './atom-ui.css';
import { COLOR_SCHEME_OPTIONS, colorScheme } from "./state/colors";
import { cooldown } from "./state/cooldown";
import { targetFrameRate } from "./state/frame-rate";
import { INIT_TYPE_OPTIONS, initType } from "./state/init-type";
import { ITERATION_STATE_OPTIONS, iterationState } from "./state/iteration-state";
import { NAMED_RULES, ruleCode } from "./state/rule";
import { scale } from "./state/scale";
import { incrementVersion } from "./state/version";
import { WORKGROUP_SIZE_OPTIONS, workgroupSize } from "./state/workgroups";
import { AtomButton } from "./ui/AtomButton";
import { AtomButtonGroup } from "./ui/AtomButtonGroup";
import { AtomGameOfLifeRule } from "./ui/AtomGameOfLife";
import { AtomSelect } from "./ui/AtomSelect";
import { AtomSlider } from "./ui/AtomSlider";

export function AtomUi(): ReactNode {
  return (
    <Card className="atom-ui">
      <Box p={2}>
        <Grid templateColumns="repeat(2, 1fr)">
          <AtomSelect atom={colorScheme} options={COLOR_SCHEME_OPTIONS} label="Color Scheme" />
          <AtomButton atom={incrementVersion}>Restart</AtomButton>
          <AtomSelect atom={ruleCode} options={NAMED_RULES} label="Named Rule" defaultLabel="Custom Rule" />
          <AtomGameOfLifeRule />
          <AtomSlider atom={cooldown} min={0} max={0.99} step={0.01} label="Cooldown" precision={2} />
          <AtomSelect atom={workgroupSize} options={WORKGROUP_SIZE_OPTIONS} label="Workgroup Size" />
          <AtomSlider atom={scale} min={0.01} max={0.99} step={0.01} label="Scale" precision={2} />
          <AtomSelect atom={initType} options={INIT_TYPE_OPTIONS} label="Init Type" />
          <AtomButtonGroup atom={iterationState} options={ITERATION_STATE_OPTIONS}label="Iteration State" />
          <AtomSlider atom={targetFrameRate} min={1} max={120} step={1} label="Target FPS" precision={0} />
        </Grid>
      </Box>
    </Card>
  )
}
