
```tsx live
import React from 'react';
import Theme from '@ols-scripts/component-theme-one';

const Demo = () => {
  const routes = [
    { link: '/a', title: '你好', component: {
      codes: [
        {
          code: "npm i @ols-scripts/component-theme-one --save\n",
          compileCode: "",
          id: "70238682460953",
          info: "bash",
          isLive: false,
        }
      ],
      content: `<h3>安装</h3>
<pre><code class="language-bash"><div id=70238682460953></div></code></pre>
<h3>使用</h3>
<pre><code class="language-jsx"><div id=8148026901918701></div></code></pre>
`,
      filePath: "/Users/dushao/Project/Myself/cli/ols-component-demo/docs/index.md",
      fileName: "index"
    } }
  ]

  return (
    <div>
      <Theme
        routes={routes}
        scopes={{}}
      />
    </div>
  );
};

ReactDOM.render(<Demo />, mountNode);
```
