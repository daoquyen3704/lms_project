import React, { useState, useContext } from 'react';
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import { AuthContext } from '../../../context/Auth'; // Import AuthContext
import { toast } from 'react-hot-toast';
import { apiUrl } from '../../../common/Config';
import { fetchJWT } from '../../../../utils/fetchJWT'
import ReactPlayer from 'react-player';
import { useEffect } from 'react';
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview, FilePondPluginFileValidateType);

const LessonVideo = ({ lesson }) => {
    const [files, setFiles] = useState([]);
    const [videoUrl, setVideoUrl] = useState();
    const { token } = useContext(AuthContext);

    useEffect(() => {
        if (lesson) {
            setVideoUrl(lesson.video_url);
        }
    }, [lesson]);

    return (
        <div className='card shadow-lg border-0'>
            <div className='card-body p-4'>
                <h4 className='h5 mb-3'>Lesson Video</h4>

                <FilePond
                    className='justify-content-between'
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
                                console.log(errors);
                                toast.error("Failed to upload image.");
                            },
                        },
                    }}
                    name="video"
                    labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
                />

                {videoUrl && (
                    <ReactPlayer
                        src={videoUrl}
                        controls={true}
                        width={"100%"}
                        height={"100%"}
                    />
                )}
            </div>
        </div>
    )
}

export default LessonVideo
