import React, { useEffect } from 'react'
import { useState } from 'react'
import { FilePond, registerPlugin } from 'react-filepond'
import 'filepond/dist/filepond.min.css'
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview, FilePondPluginFileValidateType)
import { apiUrl, token } from '../../../common/Config'
import { toast } from 'react-hot-toast'
import ReactPlayer from 'react-player'
const LessonVideo = ({ lesson }) => {
    const [files, setFiles] = useState([]);
    const [videoUrl, setVideoUrl] = useState();
    useEffect(() => {
        if (lesson) {
            setVideoUrl(lesson.video_url);
        }
    }, [lesson])
    return (
        <div className='card shadow-lg border-0'>
            <div className='card-body p-4'>
                <h4 className='h5 mb-3'>Lesson Video</h4>

                <FilePond className='justify-content-between'
                    acceptedFileTypes={['video/mp4']}
                    credits={false}
                    files={files}
                    onupdatefiles={setFiles}
                    allowMultiple={false}
                    maxFiles={1}
                    server={{
                        process: {
                            url: `${apiUrl}/save-lesson-video/${lesson.id}`,
                            method: 'POST',
                            headers: {
                                'Authorization': `Bearer ${token}`
                            },
                            onload: (response) => {
                                response = JSON.parse(response);
                                toast.success(response.message);
                                setFiles([]);
                                setVideoUrl(response.data.video_url);
                            },
                            onerror: (errors) => {
                                console.log(errors)
                            },
                        },
                    }}
                    name="video"
                    labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
                />

                {
                    videoUrl &&
                    <ReactPlayer src={videoUrl} controls={true}
                        width={"100%"} height={"100%"}
                    />

                }
            </div>

        </div>
    )

}

export default LessonVideo
