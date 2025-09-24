import React, { useEffect, useState, useContext } from 'react';
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import { AuthContext } from '../../../context/Auth'; // Import AuthContext
import { toast } from 'react-hot-toast';
import ReactPlayer from 'react-player';
import { fetchJWT } from '../../../../utils/fetchJWT';
import { apiUrl } from '../../../common/Config';

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview, FilePondPluginFileValidateType);

const LessonVideo = ({ lesson }) => {
    const { token } = useContext(AuthContext); // Get token from AuthContext
    const [files, setFiles] = useState([]);
    const [videoUrl, setVideoUrl] = useState();

    useEffect(() => {
        if (lesson && lesson.video_url) {
            setVideoUrl(lesson.video_url);
        }
    }, [lesson]);

    const handleFileUpload = (file) => {
        setFiles([file]);
    };

    return (
        <div className='card shadow-lg border-0'>
            <div className='card-body p-4'>
                <h4 className='h5 mb-3'>Lesson Video</h4>

                <FilePond
                    acceptedFileTypes={['video/mp4']}
                    credits={false}
                    files={files}
                    onupdatefiles={handleFileUpload}
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
                                const result = JSON.parse(response);
                                toast.success(result.message);
                                setFiles([]); // Reset the file input after success
                                setVideoUrl(result.data.video_url); // Update video URL
                            },
                            onerror: (errors) => {
                                console.error(errors);
                                toast.error("Video upload failed");
                            },
                        },
                    }}
                    name="video"
                    labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
                />

                {videoUrl && (
                    <div className="video-container">
                        <ReactPlayer
                            src={videoUrl}
                            controls
                            width="100%"
                            height="100%"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default LessonVideo;
