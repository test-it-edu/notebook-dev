/**
 * enum LineTypes
 * @author Ingo Andelhofs
 */
export enum LineTypes {
  Text = "text",
  Image = "img",
}


/**
 * map TypeMap
 * @author Ingo Andelhofs
 */
export const TypeMap = new Map([
  [LineTypes.Text, {
    names: ["txt", "text"],
  }],
  [LineTypes.Image, {
    names: ["img", "image"],
  }],
]);