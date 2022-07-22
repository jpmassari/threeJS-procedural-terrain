import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
        </Head>
        <body>
          <canvas id="bg"></canvas>
        	<Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument