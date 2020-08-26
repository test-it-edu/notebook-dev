/**
 * util MathJaxParser
 * @author Ingo Andelhofs
 * @pre Load "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js" with {id="MathJax-script, async}
 * @todo Load script Manually
 */
class MathJaxParser {
  private MathJax: any;
  private options: any = {};


  /**
   * Constructor
   */
  public constructor() {
    this.MathJax = (window as any).MathJax;

    // Reset
    this.MathJax.texReset();
  }


  public setContainerOptions(element: any) {
    this.options = this.MathJax.getMetricsFor(element);
    this.options.display = false;
  }


  public parse(string: string): string {
    let parsedString = this.MathJax.tex2chtml(string, this.options).outerHTML;

    // Cleanup
    this.MathJax.startup.document.clear();
    this.MathJax.startup.document.updateDocument();

    return parsedString;
  }

}


export default MathJaxParser;