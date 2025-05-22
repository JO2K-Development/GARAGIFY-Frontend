// @typescript-eslint/no-empty-object-type
import * as fabric from "fabric";
type WithCanvas<T = {}> = {
  canvas?: fabric.Canvas;
} & T;

export default WithCanvas;
