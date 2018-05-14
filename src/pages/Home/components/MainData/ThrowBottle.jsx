import React, { Component } from 'react';
import { Dialog, Button, Form, Input, Field,Switch ,Feedback} from '@icedesign/base';
import axios from 'axios';
const FormItem = Form.Item;
const Toast = Feedback.toast;

export default class ThrowBottle extends Component {
  static displayName = 'EditDialog';

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      contract:"",
      net:"",
      btn:true,
      visible: false,
      dataIndex: null,
    };
    this.field = new Field(this);
  }

  componentDidMount(){
    var thiz = this;
    axios.get('https://wx.nanayun.cn/api?act=baa20dd97293985')
    .then((response) => {
        thiz.setState({
          contract:response.data.contract,
          net:response.data.net,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  handleSubmit = () => {
    this.field.validate((errors, values) => {
      if (errors) {
        console.log('Errors in form!!!');
        return;
      }
      
      window.postMessage({
          "target": "contentscript",
          "data":{
              "to" : this.state.contract,
              "value" : "0",
              "contract" : {
                  "function" : 'throwBottle',
                  "args" : "[\""+values.content+"\"]"
              }
          },
          "method": "neb_sendTransaction"
      }, "*");

      this.onClose();
    });
  };



  onOpen = (index, record) => {
    this.field.setValues({ ...record });
    this.setState({
      visible: true,
      dataIndex: index,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const init = this.field.init;
    const { index, record } = this.props;
    const formItemLayout = {
      labelCol: {
        fixedSpan: 6,
      },
      wrapperCol: {
        span: 14,
      },
    };

    return (
      <div style={styles.editDialog}>
        <Button
          shape="warning"
          onClick={() => this.onOpen(index, record)}
        >
          扔漂流瓶
        </Button>
        <Dialog
          style={{ width: 640}}
          visible={this.state.visible}
          onOk={this.handleSubmit}
          closable="esc,mask,close"
          onCancel={this.onClose}
          onClose={this.onClose}
          title="扔漂流瓶"
        >
          <Form direction="content" field={this.field}>
            <FormItem label="漂流瓶内容：" {...formItemLayout}>
              <Input
                {...init('content', {
                  rules: [{ required: true, message: '必填选项' }],
                })}
              />
            </FormItem>
          </Form>          
        </Dialog>
      </div>
    );
  }
}

const styles = {
  editDialog: {
    display: 'inline-block',
    marginRight: '5px',
  },
};
