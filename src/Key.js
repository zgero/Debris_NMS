import React, { Component, Fragment } from 'react';
import { Card, Icon, Table, Input, Button, Radio } from "antd";
import { ToastContainer, toast } from 'react-toastify';
import md5 from "js-md5";
import { format } from 'date-fns'
import { Row, Col } from 'antd'

import 'antd/dist/antd.css';
import 'react-toastify/dist/ReactToastify.css';
import textStyle from "echarts/src/model/mixin/textStyle";


const columns = [{
    dataIndex: 'stream_name',
    key: 'stream_name',
    width: 100
},{
    dataIndex: 'generated_key',
    key: 'generated_key',
    width: 400
},{
   dataIndex: 'expired',
   key: 'expired',
   width: 200
},{
    dataIndex: 'copy',
    key: 'copy',
    width: 50,
    render: (text, record) => (
        <Button
            type="primary"
            onClick={()=>{
            navigator.clipboard.writeText(text).then(()=>{
                showToast("copy","Key value is Copied!")
            }).catch((e)=>{
                console.log("text : " +  text)
                console.log(e)
            })
        }}>
            RTMP-Address
        </Button>
    ),
},{
    dataIndex: 'rtmp',
    key: 'rtmp',
    width: 50,
    render: (text, record) => (
        <Button
            type="primary"
            onClick={()=>{
            navigator.clipboard.writeText(text).then(()=>{
                showToast("copy","RTMP ADDRESS is Copied!")
            }).catch((e)=>{
                console.log("text : " +  text)
                console.log(e)
            })
        }}>
            RTMP-Key
        </Button>
    ),
}];


const showToast = (status, msg) => {
    if(status === "copy"){
        toast.success('🦄 ' + msg, {
            theme: "colored",
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
        });
    }else if(status === "error"){
        toast.error('🦄 ' + msg, {
            theme: "colored",
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
        });
    }
}

const addressParameter = [
    { label: 'live', value: 'live' },
    { label: 'Transcode', value: 'multi' },
    { label: 'Vertical', value: 'vert'},
];


class Key extends Component {

    state = {
        data: [],
        keyText: "Key",
        rtmpText: "Rtmp",
        loading: false,
        stream_name: '',
        password: 'debris_zgero_1105',
        inputClass: "",
        placeholder: "input stream name",
        addressPara: 'live',
    };

    componentDidMount() {
    }

    inputChange = (e) => {
        let str_name = e.target.value
        this.setState({
            inputClass: "",
            stream_name: str_name,
            placeholder: "input stream name"
        })
    }

    onBtnChange = (e) => {
        this.setState({
            addressPara: e.target.value,
        })
    }

    updateStreamName = (e) => {

        if(this.state.stream_name){
            let hash = md5.create();
            let ext = Date.now() + 86400000;
            hash.update(`/${this.state.addressPara}/${this.state.stream_name}-${ext}-${this.state.password}`);
            let key = hash.hex();
            let sign = `${ext}-${key}`;
            let exp_date= format(ext, 'yy/MM/dd hh:mm:ss');
            let rtmp_address = "rtmp://" + window.location.hostname + "/" + this.state.addressPara + "/";
            let rtmp_key = this.state.stream_name + "?sign=" + sign

            this.setState(previousState => ({
                data: [...previousState.data,
                    {
                        stream_name: this.state.stream_name,
                        key: this.state.data.length,
                        generated_key: sign,
                        expired: exp_date,
                        copy: rtmp_address,
                        rtmp: rtmp_key
                    }],
                loading: false,
                stream_name: '',
                password: 'debris_zgero_1105'
            }))
        }else{
            showToast("error", "Please insert stream name")
            this.setState({
                inputClass: "invalid",
                placeholder: "Please insert stream name"
            })
        }

    }

    render() {
        return (
            <Card title={<Fragment>
                <Icon type="camera" />
                <span style={{ paddingLeft: "12px", fontSize: "16px" }}>RTMP URL & KEY Generate Tool</span>
            </Fragment>}>
                <ToastContainer
                    position="top-center"
                    autoClose={3000}
                    hideProgressBar
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss={false}
                    draggable
                    pauseOnHover={false}
                />
                <div className="ant-row" style={{color: "deepskyblue"}}>
                    <div className="ant-col ant-col-16">
                        <b>URL TYPE</b>
                    </div>
                    <Radio.Group
                        optionType="button"
                        buttonStyle="solid"
                        options={addressParameter}
                        onChange={this.onBtnChange}
                        value={this.state.addressPara}

                        className="ant-col ant-col-8"
                        block={true}
                        style={{ marginBottom: "16px", textAlign: "end" }}
                    >
                    </Radio.Group>
                </div>
                <Input
                    size="large"
                    className={this.state.inputClass}
                    prefix={<Icon type="name" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    style={{ marginBottom: "16px" }}
                    onChange={this.inputChange}
                    placeholder={this.state.placeholder}
                />
                <Button
                    block={true}
                    loading={false}
                    type="primary"
                    size="large"
                    style={{ marginBottom: "16px" }}
                    onClick = {this.updateStreamName}
                >
                    Generate!
                </Button>

                <Table
                    dataSource={this.state.data}
                    columns={columns}
                    loading={this.state.loading}
                    pagination={false}
                    showHeader={false} />

            </Card>
        );
    }
};

export default Key;
