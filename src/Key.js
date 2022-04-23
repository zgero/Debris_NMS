import React, { Component, Fragment } from 'react';
import { Card, Icon, Table, Input, Button, Radio } from "antd";
import { ToastContainer, toast } from 'react-toastify';
import md5 from "js-md5";
import { format } from 'date-fns'

import 'antd/dist/antd.css';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";

const columns = [{
    dataIndex: 'app_name',
    key: 'app_name',
    width: 60
},{
    dataIndex: 'stream_name',
    key: 'stream_name',
    width: 60
},{
    dataIndex: 'generated_key',
    key: 'generated_key',
    width: 100
},{
   dataIndex: 'expired',
   key: 'expired',
   width: 100
},{
    dataIndex: 'copy',
    key: 'copy',
    width: 40,
    render: (text, record) => (
        <Button
            type="primary"
            style={{width: "100%"}}
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
    width: 40,
    render: (text, record) => (
        <Button
            type="primary"
            style={{width: "100%"}}
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
    }else{
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
        password: "debris_zgero_1105",
        inputClass: "",
        placeholder: "input stream name",
        addressPara: 'live',
    };

    componentDidMount() {
        this.fetchRtmpDB();
        require('dotenv').config();

        console.log(process.env)
        console.log(process.env.RTMP_SECRET)
    }

    fetchRtmpDB = () => {
        this.setState({ loading: true });
        axios.get('https://debris.live/rtmp/rtmp/')
        .then(function (response) {
            return response.data;
        }).then((data) => {
            // Read total count from server
            let array_data = []
            console.log(data)
            for(const d of data){

                array_data.push({
                    app_name: d.appName,
                    stream_name: d.streamName,
                    generated_key: d.hashKey,
                    expired: d.expired,
                    copy: d.rtmpUrl,
                    rtmp: d.rtmpKey
                })

            }

            console.log(array_data)
            this.setState({
                loading: false,
                data: array_data,
            });
        }).catch(e => {
            console.log(e)
            this.setState({
                loading: false,
            });
        });
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
        e.target.selected = true
        this.setState({
            addressPara: e.target.value,
        })
    }

    updateStreamName = (e) => {

        if(this.state.stream_name){
            let body = {
                'appName': this.state.addressPara,
                'streamName': this.state.stream_name,
                'author': 'zgero'
            }

            let headers = {
                'Content-Type' : 'application/json'
            }

            axios.post('https://debris.live/rtmp/rtmp/',body,{headers: headers})
                .then(() =>{this.fetchRtmpDB()})
                .catch((e)=>{
                    console.log(e)
                    showToast("server error", "Uncaught server error")
                })

            this.setState(previousState => ({
                stream_name: '',
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
                    <div className="ant-col ant-col-xs-24 ant-col-lg-8">
                        <b>URL TYPE</b>
                    </div>

                    <Radio.Group
                        onChange={this.onBtnChange}
                        value={this.state.addressPara}
                        optionType="button"
                        buttonStyle="solid"

                        className="ant-col ant-col-xs-24 ant-col-lg-16 ant-xs-mt-10"
                        block={true}
                        style={{ marginBottom: "16px", textAlign: "end" }}
                    >
                        <Radio.Button style={{textAlign: "center"}} className={"ant-col ant-col-8"} value={"live"}>live</Radio.Button>
                        <Radio.Button style={{textAlign: "center"}} className={"ant-col ant-col-8"} value={"multi"}>transcode</Radio.Button>
                        <Radio.Button style={{textAlign: "center"}} className={"ant-col ant-col-8"} value={"verti"}>vertical</Radio.Button>
                    </Radio.Group>

                </div>
                <Input
                    size="large"
                    className={this.state.inputClass}
                    prefix={<Icon type="name" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    style={{ marginBottom: "16px" }}
                    onChange={this.inputChange}
                    value={this.state.stream_name}
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
