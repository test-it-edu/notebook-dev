/**
 * class DOMUtil
 * @author Ingo Andelhofs
 */
class DOMUtil {
  public static isChildOf(child: Node | null, parent: Node): boolean {
    while (child !== null) {
      if (child === parent)
        return true;

      child = child.parentNode;
    }
    return false;
  }
  public static isStrictChildOf(child: Node | null, parent: Node): boolean {
    child = child?.parentNode as Node | null;
    return DOMUtil.isChildOf(child, parent);
  }

  public static getDocumentFragmentInnerHTML(fragment: DocumentFragment): string {
    let div = document.createElement("div");
    div.appendChild(fragment);
    return div.innerHTML;
  }
}

export default DOMUtil;