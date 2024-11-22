import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';
import cookie from 'react-cookies';
import $ from 'jquery';

const BoardRegist = () => {
    const navigate = useNavigate();
    const [userId, setUserId] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [append_attachList, setAppend_attachList] = useState([]);

    useEffect(() => {
        const cookie_userid = cookie.load('userid');
        const cookie_usernm = cookie.load('username');
        const cookie_password = cookie.load('userpassword');

        if (cookie_userid !== undefined) {
            const expires = new Date();
            expires.setMinutes(expires.getMinutes() + 60);
            cookie.save('userid', cookie_userid, { path: '/', expires });
            cookie.save('username', cookie_usernm, { path: '/', expires });
            cookie.save('userpassword', cookie_password, { path: '/', expires });

            $("#main").show();
        } else {
            $("#main").hide();
        }
        callSessionInfoApi();
    }, [append_attachList]);

    const callSessionInfoApi = () => {
        axios.post('http://localhost:8080/member/jwtChk', {
            token1: cookie.load('userid'),
            token2: cookie.load('username')
        })
            .then(response => {
                setUserId(response.data.token1);
            })
            .catch(error => {
                console.log('작업중 오류가 발생하였습니다.');
            });
    };

    const submitClick = async (e) => {
        e.preventDefault();

        const fnValidate = () => {
            if (title === '') {
                sweetalert('제목을 입력해주세요.', '', 'error', '닫기');
                return false;
            }
            if (content === '') {
                sweetalert('내용을 입력해주세요.', '', 'error', '닫기');
                return false;
            }
            return true;
        }

        if (fnValidate()) {
            const files = append_attachList.map(file => (file.fullName));

            const jsonData = {
                bwriter: userId,
                btitle: title,
                bcon: content,
                files: files
            };

            try {
                const response = await axios.post('http://localhost:8080/board/boardRegist', jsonData);
                if (response.data === "succ") {
                    sweetalert('등록되었습니다.', '', 'success', '확인');
                    setTimeout(() => {
                        navigate('/board/boardlist');
                    }, 1500);
                }
            } catch (error) {
                alert('작업 중 오류가 발생하였습니다.');
            }
        }
    };

    const sweetalert = (title, contents, icon, confirmButtonText) => {
        Swal.fire({
            title: title,
            text: contents,
            icon: icon,
            confirmButtonText: confirmButtonText
        });
    };

    const handleFileChange = (e) => {
        const files = e.target.files;
        if (files.length > 0) {
            // 여러 파일을 반복해서 처리
            Array.from(files).forEach((file) => {
                const formData = new FormData();
                formData.append("file", file); // 한 번에 하나씩 업로드

                axios.post('http://localhost:8080/uploadAjax', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                })
                    .then(response => {
                        const fileInfo = getFileInfo(response.data);
                        setAppend_attachList(prev => [...prev, fileInfo]); // 배열에 파일 정보 추가
                    })
                    .catch(error => {
                        console.error('Error uploading file:', error);
                    });
            });
        }
    };

    const getFileInfo = (data) => {
        const filePath = data;
        let fileName;
        const fileType = filePath.split('.').pop().toLowerCase();
        if (fileType === "jpg" ||
            fileType === "jpeg" ||
            fileType === "png" ||
            fileType === "gif"
        ) {
            const lastPart = filePath.substring(filePath.lastIndexOf('/') + 1);
            fileName = lastPart.substring(lastPart.indexOf('_', 2) + 1);
        } else {
            fileName = filePath.substring(filePath.indexOf('_') + 1);
        }
        const imgSrc = `http://localhost:8080/displayFile?fileName=${filePath.replace("s_", "", 1)}`;
        const icon = getFileIcon(fileName);
        const Link = `http://localhost:8080/displayFile?fileName=${filePath}`;
        const getLink = Link.replace(Link.substring(Link.lastIndexOf('/') + 1, Link.indexOf('_') + 1), "");
        const fullName = filePath;

        console.log(fileName);
        console.log(imgSrc);
        console.log(icon);
        console.log(Link);
        console.log(getLink);
        console.log(fullName);

        return {
            fileName,
            imgSrc,
            icon,
            Link,
            getLink,
            fullName,
        };
    };

    const getFileIcon = (fileName) => {
        const extension = fileName.split('.').pop().toLowerCase();

        switch (extension) {
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
                return null;
            default:
                return '/default-icon.png';
        }
    };

    const handleDelete = (fullName) => {
        axios.post("http://localhost:8080/deleteFile", { fileName: fullName })
            .then(result => {
                if (result.data === 'deleted') {
                    setAppend_attachList(prev => prev.filter(file => file.fullName !== fullName));
                }
            })
            .catch(error => {
                console.error('Error deleting file:', error);
            });
    };

    const handleDeleteAll = () => {
        const files = append_attachList.map(file => (file.fullName));
        axios.post(`http://localhost:8080/deleteAllFiles`, { files: files })
            .then(result => {
                if (result.data === 'deleted') {
                    window.location.href = "boardlist";
                }
            })
            .catch(error => {
                console.error('Error deleting file:', error);
            });
    };

    return (
        <>
            <style>
                {`
                    .uploadedList {
                        display: grid;
                        grid-template-columns: repeat(6, 1fr); /* 한 줄에 6개씩 배치 */
                        gap: 10px; /* 각 파일 사이의 간격 */
                        list-style: none; /* 기본 list 스타일 제거 */
                        padding: 0;
                        margin: 0;
                    }

                    .uploadedList li {
                        text-align: center;
                    }

                    .uploadedList li img {
                        width: 100px;
                        height: 100px;
                        object-fit: cover; /* 이미지 비율 유지 */
                    }
                `}
            </style>

            <main id="main" style={{ display: "none" }}>
                <section className="contact">
                    <div className="container">
                        <div className="row">
                            <div className="col-sm-12 section-t8">
                                <form name="frm" id="frm" role="form" onSubmit={submitClick}>
                                    <input type="hidden" id="bwriter" name="bwriter" value={userId} />
                                    <div className="row">
                                        <div className="col-md-12 mb-3 d-flex justify-content-between align-items-center">
                                            <h2>자유게시판</h2>
                                            <a onClick={handleDeleteAll}>작성 취소</a>
                                        </div>
                                        <div className="form-group">
                                            <input type="text" name="btitle" className="form-control form-control-lg form-control-a"
                                                placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
                                        </div>
                                        <div className="col-md-12">
                                            <div className="form-group">
                                                <textarea name="bcon" className="form-control" cols="45" rows="8" placeholder="Content"
                                                    value={content} onChange={(e) => setContent(e.target.value)} />
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            File Upload
                                        </div>

                                        {/* 파일 선택 input 추가 */}
                                        <div className="form-group">
                                            <input
                                                type="file"
                                                multiple
                                                onChange={handleFileChange}
                                                className="form-control"
                                            />
                                        </div>

                                        <div className="attach-footer">
                                            <ul className="mailbox-attachments clearfix uploadedList">
                                                {append_attachList.map((file, index) => (
                                                    <li key={index}>
                                                        <span className="mailbox-attachment-icon has-img">
                                                            {file.icon ? (
                                                                /* 이미지 파일이 아닌경우 */
                                                                <a href={file.Link}>
                                                                    <img src={file.icon} alt="Attachment Icon" style={{ width: "100px", height: "100px" }} />
                                                                </a>
                                                            ) : (
                                                                <a href={file.getLink} target="blank">
                                                                    <img src={file.imgSrc} alt="Attachment" />
                                                                </a>
                                                            )}
                                                        </span>
                                                        <div className="mailbox-attachment-info">
                                                            {file.icon ? (
                                                                <>
                                                                    {/* 이미지 파일이 아닌경우 */}
                                                                    <a href={file.Link} className="mailbox-attachment-name">{file.fileName}</a>
                                                                    <a href={file.fullName} onClick={(e) => {
                                                                        e.preventDefault();
                                                                        handleDelete(file.fullName);
                                                                    }} className="btn btn-default btn-xs pull-right delbtn">
                                                                        <i className="fa fa-fw fa-remove"><span>X</span></i>
                                                                    </a>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <a href={file.getLink} target="blank" className="mailbox-attachment-name">{file.fileName}</a>
                                                                    <a href={file.fullName} onClick={(e) => {
                                                                        e.preventDefault();
                                                                        handleDelete(file.fullName);
                                                                    }} className="btn btn-default btn-xs pull-right delbtn">
                                                                        <i className="fa fa-fw fa-remove"><span>X</span></i>
                                                                    </a>
                                                                </>
                                                            )}
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="col-md-12 text-center">
                                            <button type="submit" className="btn btn-a">게시글 등록하기</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
};

export default BoardRegist;
