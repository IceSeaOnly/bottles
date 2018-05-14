import React, { Component } from 'react';
import { Dialog, Button, Form, Input, Field,Switch ,Feedback} from '@icedesign/base';
import axios from 'axios';
const FormItem = Form.Item;
const Toast = Feedback.toast;

export default class GainBottle extends Component {
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
      
      var thiz = this;
      this.call("gainBottle","[\""+values.shipTicket+"\"]",function(data){
        thiz.onClose();
        console.log(data);
        var result = JSON.parse(data.result);
        Dialog.alert({
          content: result.txt,
          closable: false,
          title: "来自:"+result.from,
          onOk: () => {
            Dialog.alert({ content: "保存好您的船票你可以反复查看该漂流瓶!" });
          }
        });

      });
    });
  };

  call = (method,args,func)=>{
    var thiz =this;
    axios.post(thiz.state.net+'/v1/user/call', {
          "from": "n1HYFhQwgC2y2StMpTMSkoHbqSKsZEVErFk",
          "to": thiz.state.contract,
          "value": "0",
          "nonce": 0,
          "gasPrice": "1000000",
          "gasLimit": "2000000",
          "contract": {
              "function": method,
              "args": args
          }
      })
      .then(function (response) {
        func(response.data.result);
      })
      .catch(function (error) {
        console.log(error);
      });
  }



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
          type="secondary"
          onClick={() => this.onOpen(index, record)}
        >
          打捞漂流瓶
        </Button>
        <Dialog
          style={{ width: 640}}
          visible={this.state.visible}
          onOk={this.handleSubmit}
          closable="esc,mask,close"
          onCancel={this.onClose}
          onClose={this.onClose}
          title="打捞漂流瓶"
        >
          <Form direction="shipTicket" field={this.field}>
            <FormItem label="您的船票：" {...formItemLayout}>
              <Input
                {...init('shipTicket', {
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
