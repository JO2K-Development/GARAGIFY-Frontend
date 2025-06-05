// @typescript-eslint/no-empty-object-type
import * as fabric from "fabric";
type WithCanvas<T = {}> = { // eslint-disable-line
  canvas?: fabric.Canvas;
} & T;

export default WithCanvas;
