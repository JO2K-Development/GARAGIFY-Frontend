//  @typescript-eslint/no-empty-object-type
type WithViewMode<T = {}> = { // eslint-disable-line
  viewMode?: boolean;
} & T;

export default WithViewMode;
