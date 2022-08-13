import React from 'react';
import { Button, Form, Input, message, Modal, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useSWRConfig } from 'swr';
import { submit } from './api';

export const Submit: React.FC = () => {
  const [submitForm] = Form.useForm();
  const { mutate } = useSWRConfig();

  return (
    <Button
      icon={<UploadOutlined />}
      onClick={() => {
        Modal.info({
          afterClose: () => submitForm.resetFields(),
          content: (
            <Form labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} form={submitForm}>
              <Form.Item name="user" label="学号" required>
                <Input />
              </Form.Item>
              <Form.Item name="content" label="result.txt" required>
                <Upload maxCount={1} beforeUpload={() => false}>
                  <Button icon={<UploadOutlined />}>点击选择文件</Button>
                </Upload>
              </Form.Item>
              <Form.Item name="avatar" label="上传头像">
                <Upload maxCount={1} beforeUpload={() => false}>
                  <Button icon={<UploadOutlined />}>点击选择文件</Button>
                </Upload>
              </Form.Item>
            </Form>
          ),
          onOk: () =>
            submitForm
              .validateFields()
              .then(async values => {
                const base64 = async (file: File) => {
                  let binary = '';
                  const bytes = new Uint8Array(await file.arrayBuffer());
                  for (let i = 0; i < bytes.length; ++i) {
                    binary += String.fromCharCode(bytes[i]);
                  }
                  return btoa(binary);
                };
                const submitData = {
                  user: values.user as string,
                  content: (await values.content.file.text()) as string,
                  avatar: values.avatar?.file && (await base64(values.avatar.file)),
                };
                await submit(submitData)
                  .then(data => mutate('leaderboard', data, { revalidate: false }))
                  .catch(() => {});
              })
              .catch(err => message.error(JSON.stringify(err?.errorFields) ?? 'unknwon error')),
          title: '提交',
        });
      }}
      type="primary"
    >
      提交
    </Button>
  );
};
