import { useEffect, useState } from 'react';
import axios from 'axios';
import cookie from 'react-cookies';

export default function RemoveInfo() {

    const [mno, setMno] = useState('');
    const [currentMno, setCurrentMno] = useState('');
    const [member, setMember] = useState({}); // 전체 회원 목록 저장
    const [password, setPassword] = useState('');

    const callMemberInfoApi = () => {
        if (currentMno !== mno || currentMno === "") {
            axios.post("http://localhost:8080/member/jwtChk", {
                token1: cookie.load('userid'),
                token2: cookie.load('username')
            }).then(response => {
                axios.post("http://localhost:8080/member/jwtLogin", {
                    mid: response.data.token1,
                    mpw: cookie.load("userpassword")
                }).then(response => {
                    try {
                        const jwtLoginData = response.data.jwtLogin;
                        console.log(jwtLoginData);

                        if (jwtLoginData && jwtLoginData.length > 0) {
                            setMember(jwtLoginData[0]);
                            const mnoFromResponse = response.data.jwtLogin[0].mno;
                            setMno(mnoFromResponse);
                            setCurrentMno(mnoFromResponse);
                        } else {
                            console.log("회원정보가 없습니다.");
                        }
                    } catch (error) {
                        console.log("회원정보 응답 중 오류가 발생하였습니다.");
                    }
                }).catch(error => {
                    console.log("회원정보 요청 중 오류가 발생하였습니다.");
                });
            }).catch(error => {
                console.log("JWT 검증 중 오류가 발생하였습니다.");
            });
        }
    }

    useEffect(() => {
        callMemberInfoApi();
    }, [currentMno]);


    //날짜 가공
    function formatDate(dateString) {
        const date = new Date(dateString);
        const year = String(date.getFullYear()).slice(2); // 연도를 두 자리로 자름
        const month = String(date.getMonth() + 1).padStart(2, '0'); // 월을 두 자리로
        const day = String(date.getDate()).padStart(2, '0'); // 일을 두 자리로
        return `${year}-${month}-${day}`;
    }



    //회원탈퇴 버튼 클릭 시 호출
    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const passwordCheckResponse = await axios.post("http://localhost:8080/passwordcheck", {
                mpw: password,
                mno: mno
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            // 비밀번호 검증 성공 시
            if (passwordCheckResponse.status === 200) {
                const isConfirmed = window.confirm("정말로 탈퇴하시겠습니까?");

                if (isConfirmed) {
                    try {
                        // 탈퇴 요청을 보내는 API 호출
                        const response = await axios.post("http://localhost:8080/deleteinfo", {
                            mno: mno  // 회원 번호
                        }, {
                            headers: {
                                "Content-Type": "application/json"  // 요청 본문이 JSON임을 명시
                            }
                        });

                        if (response.status === 200) {
                            alert("회원탈퇴가 완료되었습니다.");
                            cookie.remove('userid', { path: '/' });
                            cookie.remove('username', { path: '/' });
                            cookie.remove('userpassword', { path: '/' });
                            window.location.href = "/"; // 탈퇴 후 홈으로 리다이렉트
                        }
                    } catch (error) {

                        alert("탈퇴 처리 중 오류가 발생했습니다.");
                        console.error("오류 발생:", error);

                    }

                }
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                alert("비밀번호가 일치하지 않습니다."); // 비밀번호 불일치
            }
            else if (error.response && error.response.status === 404) {
                alert("회원 정보를 찾을 수 없습니다.");
            }
            else {
                alert("비밀번호 확인 중 오류가 발생했습니다.");
            }
        }
    }

    return (
        <div>
            <section className="intro-single">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12 col-lg-8">
                            <div className="title-single-box">
                                <h1 className="title-single">회원탈퇴</h1>
                                <span className="color-text-a">{member?.mname || ''} 회원님, 안녕하세요!</span>
                            </div>
                        </div>

                        <div className="col-md-12 col-lg-4">
                            <nav aria-label="breadcrumb" className="breadcrumb-box d-flex justify-content-lg-end">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item"><a href="#">홈</a></li>
                                    <li className="breadcrumb-item active" aria-current="page">회원정보</li>
                                </ol>
                            </nav>
                        </div>
                    </div>
                </div>
            </section>

            <main id="main-info">
                <section className="content">
                    <div className="container">
                        <form onSubmit={handleSubmit} method="post">
                            <div className="subindex_greenbox">
                                <div className="row-Flex">
                                    <ul className="subindex_row">
                                        <li className="row_item">
                                            <div className="item_text">
                                                <span className="item_text">아이디</span>
                                            </div>
                                        </li>
                                        <li className="row_item">
                                            <div className="item_text">
                                                <span className="item_text">비밀번호</span>
                                            </div>
                                        </li>
                                        <li className="row_item">
                                            <div className="item_text">
                                                <span className="item_text">이름</span>
                                            </div>
                                        </li>
                                        <li className="row_item">
                                            <div className="item_text">
                                                <span className="item_text">휴대폰번호</span>
                                            </div>
                                        </li>
                                        <li className="row_item">
                                            <div className="item_text">
                                                <span className="item_text">이메일</span>
                                            </div>
                                        </li>
                                        <li className="row_item">
                                            <div className="item_text">
                                                <span className="item_text">가입일</span>
                                            </div>
                                        </li>
                                    </ul>

                                    <div className="left-line">
                                        <ul className="subindex_row">
                                            <li className="row_item">
                                                <div className="item_text">
                                                    <span className="item_text">{member.mid}</span>
                                                </div>
                                            </li>
                                            <li className="row_item">
                                                <div className="item_text">
                                                    <input type="password" id="password" className="item_text input-green" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                                                </div>
                                            </li>
                                            <li className="row_item">
                                                <div className="item_text">
                                                    <span className="item_text">{member.mname}</span>
                                                </div>
                                            </li>
                                            <li className="row_item">
                                                <div className="item_text">
                                                    <span className="item_text">{member.mcell}</span>
                                                </div>
                                            </li>
                                            <li className="row_item">
                                                <div className="item_text">
                                                    <span className="item_text">{member.memail}</span>
                                                </div>
                                            </li>
                                            <li className="row_item">
                                                <div className="item_text">
                                                    <span className="item_text">{member.mdate ? formatDate(member.mdate) : '날짜 정보 없음'}</span>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="modInfo-footer">
                                <div className="memberInfoBtn">
                                    <button type="submit" className="green-button btn button-text">회원탈퇴</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </section>
            </main>
        </div>
    );
}