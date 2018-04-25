import React, { Component } from 'react';
import { Button, Input, Form, Spin, Tooltip, Divider, Icon, Select, Radio, Modal, Tag, Upload} from 'antd';
import axios from 'axios';
import config from '../../config';
const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;
const RadioGroup = Radio.Group;

class Step3Form extends Component {
    constructor(props) {
        super(props);
        this.state = {
            confirmDirty: false,
            loading: false,
            previewVisible: false,
            previewImage: '',
            fileList: [],
            fileList1: [],
            fileList2: [],
        }
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
        this.setState({ 
            fileList1: {...fileList} 
        });
    };
    handleChange2 = ({ fileList }) => {
        console.log(fileList);
        this.setState({ 
            fileList1: {...fileList} 
        });
    };
    handleChange3 = ({ fileList }) => {
        console.log(fileList);
        this.setState({ 
            fileList2: {...fileList} 
        });
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            console.log(values);
            if (!err) {
                console.log(values);
                const img1  = values.identity_front_image['file'];
                console.log(img1.response.data.image_url);
                values.identity_front_image = img1.response.data.image_url;
                const img2  = values.identity_front_image['file'];
                console.log(img2.response.data.image_url);
                values.identity_back_image = img2.response.data.image_url;
                const img3  = values.identity_front_image['file'];
                console.log(img3.response.data.image_url);
                values.identity_back_image = img3.response.data.image_url;
                this.props.handleNext(values);
            }
        });
    };
    handlePrev = () => {
        this.props.handlePrev();
    };
    render() {
        const { getFieldDecorator } = this.props.form;

        const formItemLayout = {
            labelCol: {
              xs: { span: 8 },
              sm: { span: 8 },
            },
            wrapperCol: {
              xs: { span: 8 },
              sm: { span: 8 },
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
        let env = "";
        if(process.env.REACT_APP_BETA){
            env = process.env.REACT_APP_BETA;
        }else{
            env = (process && process.env && process.env.NODE_ENV) || 'production';
        }
        console.log(env);
        const uploadImgUrl = config[`${env}_upload_url`] + '/api/image/upload';
        console.log(uploadImgUrl);
        return (
            <Spin spinning={this.state.loading}>
                <Form onSubmit={this.handleSubmit}>
                    <Divider className="reg_title" orientation="left"><Icon type="user"></Icon>证件信息</Divider>
                    <FormItem
                        {...formItemLayout}
                        label="身份证号"
                        >
                        {getFieldDecorator('identity', {
                            initialValue: "",
                            rules: [{
                                required: true, message: '请输入身份证号吗!'
                            },{
                                pattern: /^\d{15}|\d{17}(\d|X)$/,message:"请输入正确的身份证号"
                            }]
                        })(
                            <Input placeholder="请输入身份证号码"/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="身份证正面"
                        extra="带有头像的一面"
                        >
                        {getFieldDecorator('identity_front_image')(
                            <Upload
                                accept="image/jpg,image/jpeg,image/png"
                                name="image"
                                action={uploadImgUrl}
                                listType="picture-card"
                                fileList={this.state.fileList}
                                data={{type:1,account:this.props.editData.username}}
                                onPreview={this.handlePreview}
                                onChange={this.handleChange}
                                >
                                {this.state.fileList.length >= 1 ? null : uploadButton}
                            </Upload>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="身份证反面"
                        extra="带有国徽的一面">
                        {getFieldDecorator('identity_back_image', )(
                            <Upload
                                accept="image/jpg,image/jpeg,image/png"
                                name="image"
                                action={uploadImgUrl}
                                listType="picture-card"
                                fileList={this.state.fileList1}
                                data={{type:2,account:this.props.editData.username}}
                                onPreview={this.handlePreview}
                                onChange={this.handleChange1}
                                >
                                {this.state.fileList1.length >= 1 ? null : uploadButton}
                            </Upload>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="本人手持身份证正面照片"
                        extra=""
                        >
                        {getFieldDecorator('risk_tips_image', )(
                            <Upload
                                accept="image/jpg,image/jpeg,image/png"
                                name="image"
                                action={uploadImgUrl}
                                listType="picture-card"
                                fileList={this.state.fileList2}
                                data={{type:3,account:this.props.editData.username}}
                                onPreview={this.handlePreview}
                                onChange={this.handleChange2}
                                >
                                {this.state.fileList2.length >= 1 ? null : uploadButton}
                            </Upload>
                        )}
                    </FormItem>
                    <FormItem {...tailFormItemLayout}>
                        <Tag color="blue">1.每个文件最大2MB，文件类型为jpg/jpeg/png</Tag>
                        <Tag color="blue">2.请上传您的清晰身份证明文件，必须由政府发布具有照片和您姓名的身份证。</Tag>
                        <Tag color="blue">3.您的相片、个人信息、签署、发行和有效期，以及ID号码必须全部清楚显示您上传的文件中。</Tag>
                    </FormItem>
                    <FormItem {...tailFormItemLayout}>
                        <Button type="info" onClick={this.handlePrev}>上一步</Button>
                        <Button type="primary" style={{marginLeft:40}} htmlType="submit">下一步</Button>
                    </FormItem>
                </Form>
            </Spin>
        );
    }
};
export default  Form.create()(Step3Form);