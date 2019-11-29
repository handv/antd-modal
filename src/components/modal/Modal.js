import * as React from 'react'
import Dialog from 'rc-dialog'
import * as PropTypes from 'prop-types'
import classNames from 'classnames'
import addEventListener from 'rc-util/lib/Dom/addEventListener'
// import Icon from '../icon'
// import Button from '../button'
import {Icon, Button} from 'antd'

let mousePosition
export const destroyFns = []

// ref: https://github.com/ant-design/ant-design/issues/15795
const getClickPosition = (e) => {
  mousePosition = {
    x: e.pageX,
    y: e.pageY
  }
  // 100ms 内发生过点击事件，则从点击位置动画展示
  // 否则直接 zoom 展示
  // 这样可以兼容非点击方式展开
  setTimeout(() => (mousePosition = null), 100)
}

// 只有点击事件支持从鼠标位置动画展开
if (
  typeof window !== 'undefined' &&
  window.document &&
  window.document.documentElement
) {
  addEventListener(document.documentElement, 'click', getClickPosition)
}

export default class Modal extends React.Component {
  static info

  static success

  static error

  static warn

  static warning

  static confirm

  static destroyAll

  static defaultProps = {
    width: 520,
    transitionName: 'zoom',
    maskTransitionName: 'fade',
    confirmLoading: false,
    visible: false,
    okType: 'primary'
  }

  static propTypes = {
    prefixCls: PropTypes.string,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
    okText: PropTypes.node,
    cancelText: PropTypes.node,
    centered: PropTypes.bool,
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    confirmLoading: PropTypes.bool,
    visible: PropTypes.bool,
    footer: PropTypes.node,
    title: PropTypes.node,
    closable: PropTypes.bool,
    closeIcon: PropTypes.node
  }

  handleCancel = (e) => {
    const {onCancel} = this.props
    if (onCancel) {
      onCancel(e)
    }
  }

  handleOk = (e) => {
    const {onOk} = this.props
    if (onOk) {
      onOk(e)
    }
  }

  getPrefixCls = (suffixCls, customizePrefixCls) => {
    if (customizePrefixCls) return customizePrefixCls;

    return `ant-${suffixCls}`;
  }

  renderFooter = (locale) => {
    const {okText, okType, cancelText, confirmLoading} = this.props
    return (
      <div>
        <Button onClick={this.handleCancel} {...this.props.cancelButtonProps}>
          {cancelText || locale.cancelText}
        </Button>
        <Button
          type={okType}
          loading={confirmLoading}
          onClick={this.handleOk}
          {...this.props.okButtonProps}
        >
          {okText || locale.okText}
        </Button>
      </div>
    )
  }

  render() {
    const {
      prefixCls: customizePrefixCls,
      footer,
      visible,
      wrapClassName,
      centered,
      getContainer,
      closeIcon,
      ...restProps
    } = this.props

    const prefixCls = this.getPrefixCls('modal', customizePrefixCls)
    const defaultFooter = this.renderFooter

    const closeIconToRender = (
      <span className={`${prefixCls}-close-x`}>
        {closeIcon || (
          <Icon className={`${prefixCls}-close-icon`} type="close" />
        )}
      </span>
    )
    return (
      <Dialog
        {...restProps}
        getContainer={
          getContainer
        }
        prefixCls={prefixCls}
        wrapClassName={classNames(
          {[`${prefixCls}-centered`]: !!centered},
          wrapClassName
        )}
        footer={footer === undefined ? defaultFooter : footer}
        visible={visible}
        mousePosition={mousePosition}
        onClose={this.handleCancel}
        closeIcon={closeIconToRender}
      />
    )
  }
}
