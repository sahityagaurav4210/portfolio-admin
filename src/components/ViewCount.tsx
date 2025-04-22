import { memo, ReactNode } from 'react';
import { IViewCount } from '../interfaces/component_props.interface';

function ViewCount({ count }: IViewCount): ReactNode {
  if (count === -2) return "Loading";
  else if (count === -1) return "Not Available";
  else return count;
}

export default memo(ViewCount);