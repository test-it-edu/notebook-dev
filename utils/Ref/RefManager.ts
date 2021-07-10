

/**
 * Ref Manager
 * @author Ingo Andelhofs
 */
class RefManager<T> {

  private ref: T;

  public createRef = (element: T) => {
    this.ref = element;
  }

  public get = (): T => {
    return this.ref;
  }
}

export default RefManager;