import React, { Component } from 'react';
import axios from 'axios';
import { Button ,Dialog} from '@icedesign/base';
import IceContainer from '@icedesign/container';
import ThrowBottle from './ThrowBottle';
import GainBottle from './GainBottle'
export default class MainData extends Component {
  static displayName = 'MainData';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      contract:"",
      net:"",
      bottles:'loading',
      unReadBottles:'loading',
      playTimes:'loading',
    };
  }

  componentDidMount(){
    var thiz = this;
    axios.get('https://wx.nanayun.cn/api?act=baa20dd97293985')
    .then((response) => {
        thiz.setState({
          contract:response.data.contract,
          net:response.data.net,
        },function(){
          thiz.fetchData();
        }
        );
      })
      .catch((error) => {
        console.log(error);
      });
  }

  fetchData(){
    var thiz = this;
    this.call("getBottles","[]",function(data){
      thiz.setState({bottles:data.result});
    });
    this.call("getUnReadBottles","[]",function(data){
      thiz.setState({unReadBottles:data.result});
    });
    this.call("getPlayTimes","[]",function(data){
      thiz.setState({playTimes:data.result});
    });
  }

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

  gain = ()=>{
    window.postMessage({
          "target": "contentscript",
          "data":{
              "to" : this.state.contract,
              "value" : "0",
              "contract" : {
                  "function" : 'salvage',
                  "args" : "[]"
              }
          },
          "method": "neb_sendTransaction"
      }, "*");

    Dialog.alert({
      content: "请记住您的交易哈希，该哈希码就是您的船票",
      closable: false,
      title: "请注意",
    });
  }

  render() {
    return (
      <IceContainer>
        <div style={styles.content}>
          <div style={styles.contentItem}>
            <div style={styles.contentNum}>
              <span style={styles.bigNum}>{this.state.bottles}</span>
            </div>
            <div style={styles.contentDesc}>已有漂流瓶</div>
          </div>
          <div style={styles.contentItem}>
            <div style={styles.contentNum}>
              <span style={styles.bigNum}>{this.state.unReadBottles}</span>
            </div>
            <div style={styles.contentDesc}>未读漂流瓶</div>
          </div>
          <div style={styles.contentItem}>
            <div style={styles.contentNum}>
              <span style={styles.bigNum}>{this.state.playTimes}</span>
            </div>
            <div style={styles.contentDesc}>全网游戏次数</div>
          </div>
        </div>

        <IceContainer style={{textAlign:'center'}}>
          <div>
            <Button shape="dark">游戏说明</Button> &nbsp;&nbsp;
            <Button type="primary" onClick={this.gain}>获得船票</Button> &nbsp;&nbsp;
            <GainBottle/>
            <ThrowBottle/>
          </div>
        </IceContainer>
      </IceContainer>

    );
  }
}

const styles = {
  wrapper: {
    background: '#F4F4F4',
  },
  content: {
    width: '100%',
    height: 220,
    maxWidth: 1024,
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    margin: '0 auto',
  },
  contentItem: {},
  contentNum: {
    display: 'flex',
    alignItems: 'center',
  },
  bigNum: {
    color: '#333',
    fontSize: 68,
  },
  symbol: {
    color: '#333',
    fontSize: 40,
    marginLeft: 10,
  },
  contentDesc: {
    color: '#666666',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 6,
  },
};
