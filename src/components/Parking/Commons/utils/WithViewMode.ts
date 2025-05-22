//  @typescript-eslint/no-empty-object-type
type WithViewMode<T = {}> = {
  viewMode?: boolean;
} & T;

export default WithViewMode;
