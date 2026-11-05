import { Indicator, type IndicatorProps } from "@mantine/core";
import { formatUnreadCount } from "@/utils/chat.util";
import classes from "./UnreadIndicator.module.css";

type UnreadIndicatorProps = Omit<
  IndicatorProps,
  "label" | "disabled" | "color"
> & {
  count: number;
};

const UnreadIndicator = ({ count, ...rest }: UnreadIndicatorProps) => (
  <Indicator
    key={count}
    label={formatUnreadCount(count)}
    color="red"
    disabled={count === 0}
    classNames={{ indicator: classes.pop }}
    {...rest}
  />
);

export default UnreadIndicator;
