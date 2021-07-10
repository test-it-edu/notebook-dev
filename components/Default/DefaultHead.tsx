import React, {Component, ReactNode} from "react";
import Head from "next/head";


/**
 * DefaultHead Component
 * @author Ingo Andelhofs
 */
class DefaultHead extends Component<never, never> {

  // Rendering
  public render(): ReactNode {
    return <Head>
      <title>Notebook | Ingo Andelhofs</title>
      <meta name="description" content="A block-based markdown editor created with React."/>
      <link rel="icon" href="/favicon.ico"/>
    </Head>;
  }
}

export default DefaultHead;