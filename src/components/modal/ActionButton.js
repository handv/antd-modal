import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Button} from 'antd';

export default class ActionButton extends React.Component {
  timeoutId;

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  componentDidMount() {
    if (this.props.autoFocus) {
      const $this = ReactDOM.findDOMNode(this) ;
      this.timeoutId = setTimeout(() => $this.focus());
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timeoutId);
  }

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

  render() {
    const { type, children, buttonProps } = this.props;
    const { loading } = this.state;
    return (
      <Button type={type} onClick={this.onClick} loading={loading} {...buttonProps}>
        {children}
      </Button>
    );
  }
}