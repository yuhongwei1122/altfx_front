import React, { Component } from 'react';
import { Button, Input, Form, Icon, Spin, message } from 'antd';
import axios from 'axios';
import qs from 'qs';
const FormItem = Form.Item;

class AddBankForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            account: "",
            fileList: [],
            previewVisible: false,
            previewImage: ''
        }
    };
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
            this.setState({loading: true});
            values.id = this.props.editData.id;
            axios.post('/platform/user/perms/update',qs.stringify(values
            )).then((res) => {
                this.setState({loading: false});
                if(Number(res.error.returnCode) === 0){
                    this.props.handleEditOk();
                }else{
                    message.error(res.error.retrunUserMessage);
                }
            });
          }
        });
    };
    handleCancel = () => this.setState({ previewVisible: false })

    handlePreview = (file) => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    }

    handleChange = ({ fileList }) => {
        console.log(fileList);
        this.setState({ fileList });
    };
    componentWillMount(){
        if(sessionStorage.getItem("altfx_user")){
            this.setState({
                loading: true,
                account: JSON.parse(sessionStorage.getItem("altfx_user")) ? JSON.parse(sessionStorage.getItem("altfx_user")).account : "altfx"
            });
        }
    };
    componentDidMount(){
        this.setState({
            loading: false
        });
    };
    
    render() {
        const { getFieldDecorator } = this.props.form;

        const formItemLayout = {
          labelCol: {
            xs: { span: 24 },
            sm: { span: 6 },
          },
          wrapperCol: {
            xs: { span: 24 },
            sm: { span: 16 },
          },
        };
        const tailFormItemLayout = {
            wrapperCol: {
              xs: {
                span: 24,
                offset: 0,
              },
              sm: {
                span: 16,
                offset: 8,
              },
            },
        };
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">点击上传</div>
            </div>
        );
        let env = (process && process.env && process.env.NODE_ENV) || 'production';
        console.log(env);
        const uploadImgUrl = config[`${env}_upload_url`] + '/api/image/upload';
        console.log(uploadImgUrl);
        return (
            <Spin spinning={this.state.loading}>
                <Form onSubmit={this.handleSubmit}>
                    <FormItem
                        {...formItemLayout}
                        label="姓名"
                        >
                        {getFieldDecorator('username')(
                            <Input disabled/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="姓名拼音"
                        >
                        {getFieldDecorator('english_name')(
                            <Input disabled/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="银行名称"
                        >
                        {getFieldDecorator('bank_name', {
                            rules: [{
                                required: true, message: '请输入银行名称!',
                            }],
                        })(
                            <Input placeholder="请输入银行名称"/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="开户行"
                        >
                        {getFieldDecorator('opening_bank', {
                            rules: [{
                                required: true, message: '请输入开户行!',
                            }],
                        })(
                            <Input placeholder="请输入开户行"/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="卡号"
                        >
                        {getFieldDecorator('card_no', {
                            rules: [{
                                required: true, message: '请输入卡号!',
                            }],
                        })(
                            <Input placeholder="请输入卡号"/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="开户行所在省"
                        >
                        {getFieldDecorator('province', {
                            rules: [{
                                required: true, message: '请输入开户行所在省!',
                            }],
                        })(
                            <Input placeholder="请输入开户行所在省"/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="开户行所在省"
                        >
                        {getFieldDecorator('city', {
                            rules: [{
                                required: true, message: '请输入开户行所在市!',
                            }],
                        })(
                            <Input placeholder="请输入开户行所在市"/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="身份证正面"
                        extra="带有头像的一面"
                        >
                        {getFieldDecorator('card_img')(
                            <Upload
                                accept="image/jpg,image/jpeg,image/png"
                                name="image"
                                action={uploadImgUrl}
                                listType="picture-card"
                                fileList={this.state.fileList}
                                data={{type:1,account:this.state.account}}
                                onPreview={this.handlePreview}
                                onChange={this.handleChange}
                                >
                                {this.state.fileList.length >= 1 ? null : uploadButton}
                            </Upload>
                        )}
                    </FormItem>
                    <FormItem {...tailFormItemLayout}>
                        <Button onClick={this.props.handleEditCancel}>取消</Button>
                        <Button type="primary" style={{marginLeft:40}} htmlType="submit">确认</Button>
                    </FormItem>
                </Form>
            </Spin>
        );
    }
};
export default  Form.create({
    mapPropsToFields(props) {
        return {
            username: Form.createFormField({
                ...props.editData,
                value: props.editData['username'],
            }),
            english_name: Form.createFormField({
                ...props.editData,
                value: props.editData['english_name'],
            }),
        };
    }
})(AddBankForm);