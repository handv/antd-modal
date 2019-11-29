import React from 'react';
import './App.css';
import { Button} from 'antd'
import Modal from './components/modal'

class App extends React.Component {
  state = {visible: false}

  showModal = () => {
    this.setState({
      visible: true
    })
  }

  handleOk = e => {
    console.log(e)
    this.setState({
      visible: false
    })
  }

  handleCancel = e => {
    console.log(e)
    this.setState({
      visible: false
    })
  }

  renderContent = () => (
    <React.Fragment>
      <img src="http://ydschool-online.nos.netease.com/1551365087638timg.jpeg" alt=""/>
      <p>你需要帮助小蜜蜂采集2份花粉，制作4份蜂蜜</p>
    </React.Fragment>
  )

  render() {
    return (
      <div className="container">
        <Button type="primary" onClick={this.showModal}>
          {this.state.visible ? 'Close' : 'Open'} Modal
        </Button>
        <Modal
          title="Basic Modal"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
        </Modal>
      </div>
    )
  }
}

export default App;
