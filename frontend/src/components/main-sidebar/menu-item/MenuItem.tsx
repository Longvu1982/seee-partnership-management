import { type FC } from "react";
import CollapsibleMenuItem from "./CollapsibleMenuItem";
import SingleMenuItem from "./SingleMenuItem";
import { type TMenuItem } from "./menuItems.type";

const MenuItem: FC<TMenuItem> = (props) => {
  if (props.type === "single") return <SingleMenuItem {...props} />;

  return (
    <CollapsibleMenuItem
      items={props.items ?? []}
      title={props.title}
      level={props.level}
    />
  );
};

export default MenuItem;
