import * as React from 'react';
import * as ReactDOM from 'react-dom';
import classNames from 'classnames';
import {Icon} from 'antd';
import Dialog, { destroyFns } from './Modal';
import ActionButton from './ActionButton';
//import { getConfirmLocale } from './locale';

const IS_REACT_16 = !!ReactDOM.createPortal;

const ConfirmDialog = (props) => {
  const {
    onCancel,
    onOk,
    close,
    zIndex,
    afterClose,
    visible,
    keyboard, // 是否支持键盘 esc 关闭
    centered,
    getContainer,
    maskStyle,
    okButtonProps,
    cancelButtonProps,
    iconType = 'question-circle'
  } = props

  // ↓以下为设置初始参数
  // 支持传入{ icon: null }来隐藏`Modal.confirm`默认的Icon
  const icon = props.icon === undefined ? iconType : props.icon;
  const okType = props.okType || 'primary';
  const prefixCls = props.prefixCls || 'ant-modal';
  const contentPrefixCls = `${prefixCls}-confirm`;
  // 是否需要按钮，默认为 true，保持向下兼容
  const okCancel = 'okCancel' in props ? props.okCancel : true;
  const width = props.width || 416;
  const style = props.style || {};
  const mask = props.mask === undefined ? true : props.mask;
  // 默认为 false，保持旧版默认行为
  const maskClosable = props.maskClosable === undefined ? false : props.maskClosable;
  //const runtimeLocale = getConfirmLocale();
  const okText = props.okText || 'ok' //(okCancel ? runtimeLocale.okText : runtimeLocale.justOkText);
  const cancelText = props.cancelText || 'cancle' //runtimeLocale.cancelText;
  const autoFocusButton = props.autoFocusButton === null ? false : props.autoFocusButton || 'ok';
  const transitionName = props.transitionName || 'zoom';
  const maskTransitionName = props.maskTransitionName || 'fade';

  const classString = classNames(
    contentPrefixCls,
    `${contentPrefixCls}-${props.type}`, // type: info,success,error,warning,confirm
    props.className,
  );

  const cancelButton = okCancel && (
    <ActionButton
      actionFn={onCancel}
      closeModal={close}
      autoFocus={autoFocusButton === 'cancel'}
      buttonProps={cancelButtonProps}
    >
      {cancelText}
    </ActionButton>
  );

  const iconNode = typeof icon === 'string' ? <Icon type={icon} /> : icon;

  return (
    <Dialog
      prefixCls={prefixCls}
      className={classString}
      wrapClassName={classNames({ [`${contentPrefixCls}-centered`]: !!props.centered })}
      onCancel={() => close({ triggerCancel: true })}// todo:深入了解
      visible={visible}
      title=""
      transitionName={transitionName}
      footer=""
      maskTransitionName={maskTransitionName}
      mask={mask}
      maskClosable={maskClosable}
      maskStyle={maskStyle}
      style={style}
      width={width}
      zIndex={zIndex}
      afterClose={afterClose}
      keyboard={keyboard}
      centered={centered}
      getContainer={getContainer}
    >
      <div className={`${contentPrefixCls}-body-wrapper`}>
        <div className={`${contentPrefixCls}-body`}>
          {iconNode}
          <span className={`${contentPrefixCls}-title`}>{props.title}</span>
          <div className={`${contentPrefixCls}-content`}>{props.content}</div>
        </div>
        <div className={`${contentPrefixCls}-btns`}>
          {cancelButton}
          <ActionButton
            type={okType}
            actionFn={onOk}
            closeModal={close}
            autoFocus={autoFocusButton === 'ok'}
            buttonProps={okButtonProps}
          >
            {okText}
          </ActionButton>
        </div>
      </div>
    </Dialog>
  );
};

export default function confirm(config) {
  const div = document.createElement('div');
  document.body.appendChild(div);
  // eslint-disable-next-line no-use-before-define
  let currentConfig = { ...config, close, visible: true };

  function destroy(...args) {
    /**
     * 从 DOM 中卸载组件，会将其事件处理器（event handlers）和 state 一并清除。
     * 如果指定容器上没有对应已挂载的组件，这个函数什么也不会做。
     * 如果组件被移除将会返回 true，如果没有组件可被移除将会返回 false。
     */
    const unmountResult = ReactDOM.unmountComponentAtNode(div);
    // 删除新创建的div
    if (unmountResult && div.parentNode) {
      div.parentNode.removeChild(div);
    }

    // 执行onCancel
    const triggerCancel = args.some(param => param && param.triggerCancel);
    if (config.onCancel && triggerCancel) {
      config.onCancel(...args);
    }

    /** 
     * 使用 Modal.destroyAll() 可以销毁弹出的确认窗
     * （即上述的 Modal.info、Modal.success、Modal.error、Modal.warning、Modal.confirm）。
     * 通常用于路由监听当中，处理路由前进、后退不能销毁确认对话框的问题，而不用各处去使用实例的返回值进行关闭
     * （modal.destroy() 适用于主动关闭，而不是路由这样被动关闭）
     */
    for (let i = 0; i < destroyFns.length; i++) {
      const fn = destroyFns[i];
      // eslint-disable-next-line no-use-before-define
      if (fn === close) {
        destroyFns.splice(i, 1);
        break;
      }
    }
  }

  function render(props) {
    ReactDOM.render(<ConfirmDialog getContainer={false} {...props} />, div);
  }

  function close(...args) {
    currentConfig = {
      ...currentConfig,
      visible: false,
      afterClose: destroy.bind(this, ...args),
    };
    if (IS_REACT_16) {
      render(currentConfig);
    } else {
      destroy(...args);
    }
  }

  function update(newConfig) {
    currentConfig = {
      ...currentConfig,
      ...newConfig,
    };
    render(currentConfig);
  }

  render(currentConfig);

  destroyFns.push(close);

  return {
    destroy: close,
    update,
  };
}