import React, { useMemo, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { showError, validateFileType } from "../../helpers/globalFunctions";
import {  Form, Upload, UploadFile as AntUploadFile, Image, GetProp, UploadProps, UploadFile as uploadFileType } from "antd";

interface Props {
    name: string;
    label: string;
    fileType: string;
    errorMessage: string;
    fileTypeError: string;
    requiredImage: boolean;
    fileListArr: AntUploadFile[];
    validateTrigger: string[];
    setFileList: React.Dispatch<React.SetStateAction<AntUploadFile[]>>;
    setImageUrl: React.Dispatch<React.SetStateAction<string>>;
}

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const UploadFile: React.FC<Props> = ({
    name,
    label,
    fileType,
    fileListArr,
    setFileList,
    errorMessage,
    requiredImage,
    fileTypeError,
    validateTrigger,
    setImageUrl
}) => {
    const [previewImage, setPreviewImage] = useState('');
    const [previewOpen, setPreviewOpen] = useState(false);

    const handlePreview = async (file: uploadFileType) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    const getBase64 = (file: FileType): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });


    const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    }

    const uploadProps = useMemo(
        () => ({
            beforeUpload: (file: AntUploadFile) => {
                const isAllowedType = validateFileType(file, fileType);
                const isAllowedSize = file.size ? file.size <= 50 * 1024 * 1024 : false;

                if (!isAllowedType) {
                    showError(fileTypeError);
                    return false; // Stop the upload process if the file type is not allowed
                }

                if (!isAllowedSize && fileType.includes("video/mp4")) {
                    showError(`(${file.name}) exceeds the maximum file size of 50MB.`);
                    return false; // Stop the upload process if the file size is exceeds
                }
                setFileList([file]);
                return false;
            },
            onRemove: (file: AntUploadFile) => {
                if (fileListArr?.some((item) => item.uid === file.uid)) {
                    setFileList((fileEle) =>
                        fileEle.filter((item) => item.uid !== file.uid)
                    );
                    setImageUrl('');
                    return true;
                }
                return false;
            },
        }),
        [fileListArr, setFileList]
    );

    const uploadButton = (
        <button style={{ border: 0, background: 'none' }} type="button">
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </button>
    );

    return (
        <>
            <Form.Item
                // label={<label className='label'>{label}</label>}
                name={name}
                rules={[{ required: requiredImage, message: errorMessage }]}
                validateTrigger={validateTrigger}
            >
                <Upload
                    accept={fileType}
                    listType='picture-card'
                    // className='w-100'
                    maxCount={1}
                    onPreview={handlePreview}
                    {...uploadProps}
                    fileList={fileListArr}
                    onChange={handleChange}
                >
                    {uploadButton}
                </Upload>
            </Form.Item>
            <Image
                wrapperStyle={{ display: 'none' }}
                preview={{
                    visible: previewOpen,
                    onVisibleChange: (visible) => setPreviewOpen(visible),
                    afterOpenChange: (visible) => !visible && setPreviewImage(''),
                }}
                src={previewImage}
            />
        </>
    );
};

export default UploadFile;
