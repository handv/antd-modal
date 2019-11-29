## :bulb: antd modal源码解析

antd modal弹窗模块，是基于[rc-dialog](https://github.com/react-component/dialog)进行二次开发的。代码部分在`src/components/modal`中就是modal部分的源码。

#### rc-dialog参数

<table class="table table-bordered table-striped">
    <thead>
    <tr>
        <th style="width: 100px;">name</th>
        <th style="width: 50px;">type</th>
        <th style="width: 50px;">default</th>
        <th>description</th>
    </tr>
    </thead>
    <tbody>
        <tr>
          <td>getContainer</td>
          <td>HTMLElement | () => HTMLElement | Selectors | false</td>
          <td>document.body</td>
          <td>指定 Modal 挂载的 HTML 节点, false 为挂载在当前 dom</td>
        </tr>
        <tr>
          <td>prefixCls</td>
          <td>string</td>
          <td>rc-dialog</td>
          <td>dialog节点的类名前缀</td>
        </tr>
        <tr>
          <td>wrapClassName</td>
          <td>string</td>
          <td>无</td>
          <td>对话框外层容器的类名</td>
        </tr>
        <tr>
          <td>footer</td>
          <td>string|ReactNode</td>
          <td>确定取消按钮</td>
          <td>底部内容，当不需要默认底部按钮时，可以设为 footer={null}</td>
        </tr>
        <tr>
          <td>visible</td>
          <td>boolean</td>
          <td>false</td>
          <td>对话框是否可见</td>
        </tr>
        <tr>
          <td>mousePosition</td>
          <td>{x:number,y:number}</td>
          <td>无</td>
          <td>设置当前鼠标的坐标pageX和pageY</td>
        </tr>
        <tr>
          <td>onClose</td>
          <td>function</td>
          <td>无</td>
          <td>点击关闭图标或蒙层时调用</td>
        </tr>
        <tr>
          <td>closeIcon</td>
          <td>ReactNode</td>
          <td>无</td>
          <td>自定义关闭图标</td>
        </tr>
    </tbody>
</table>

#### 原理

- footer

modal有一个默认footer，带`确定`和`取消`的两个`ActionButton`

- ActionButton

二次封装后的`antd-Button`，带一个onClick方法

```
onClick = () => {
  const { actionFn, closeModal } = this.props;
  if (actionFn) {
    let ret;
    if (actionFn.length) {
      ret = actionFn(closeModal);
    } else {
      ret = actionFn();
      if (!ret) {
        closeModal();
      }
    }
    if (ret && ret.then) {
      this.setState({ loading: true });
      ret.then(
        (...args) => {
          // It's unnecessary to set loading=false, for the Modal will be unmounted after close.
          // this.setState({ loading: false });
          closeModal(...args);
        },
        (e) => {
          // Emit error when catch promise reject
          // eslint-disable-next-line no-console
          console.error(e);
          // See: https://github.com/ant-design/ant-design/issues/6183
          this.setState({ loading: false });
        },
      );
    }
  } else {
    closeModal();
  }
};
```

- Modal.info / Modal.error / Modal.warn / Modal.success

代码见`src/components/modal/index.js`, footer={null}

此部分实现了一个confirm(...props)方法。

  - confirm里有个visible的参数，还有一个render的方法。在执行confirm()的时候，会调用render()生成一个<rc-dialog visible={true} />
  - confirm里还有一个close方法，在点击右上角关闭的时候，会调用close(),生成一个<rc-dialog visible={false} />
