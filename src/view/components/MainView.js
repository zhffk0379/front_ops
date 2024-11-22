import "./Font.css";
import React, { useEffect, useState } from "react";
import slide_1 from "../../resources/assets/img/slide-1.jpg";
import slide_2 from "../../resources/assets/img/slide-2.jpg";
import slide_3 from "../../resources/assets/img/slide-3.jpg";
import slide_4 from "../../resources/assets/img/slide-4.jpg";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules'; // 필요한 모듈 import
import axios from "axios";

const MainView = () => {

    const [productList, setproductList] = useState([])

    useEffect(() => {

        callGoodsListApi();

    }, [])

    const callGoodsListApi = () => {

        axios.get("http://localhost:8080/goods/goodslist/")

            .then(response => {

                console.log(response.data)

                console.log(response.data.goodslist)

                setproductList(response.data.goodslist)

            })

    }










    /* 넘기는 버튼 스타일 */
    const buttonStyle = {
        color: 'white', // 버튼 텍스트 색상
        width: '60px', // 버튼 너비
        height: '120px', // 버튼 높이
    };

    // const swiperSettings1 = {

    // }

    // const swiperSettings2 = {

    // }

    return (

        <>

            <Swiper
                style={{ height: '800px' }} // Swiper의 높이 설정
                modules={[Navigation, Pagination, Autoplay]} // 사용할 모듈 추가
                spaceBetween={10} // 슬라이드 간격
                slidesPerView={1} // 보이는 슬라이드 수
                navigation={{
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                }} // 내비게이션 버튼 활성화
                pagination={{ clickable: true }} // 페이지네이션
                autoplay={{ delay: 2500, disableOnInteraction: false }} // 자동 재생 설정
                loop={true} // 루프 설정
            >

                {/* 밑에 버튼 스타일 지정 및 타이틀 색변환 */}
                <style>
                    {`
                    .swiper-pagination-bullet {
                        background: white !important; /* 기본 색상 */
                    }
                    .swiper-pagination-bullet-active {
                        background: white !important; /* 활성 상태 색상 */
                    }
                    .intro-title {
                        color: white;
                    }
                    .overlay {
                        pointer-events: none;
                    }
                `}
                </style>

                <Swiper />
                <SwiperSlide style={{ backgroundImage: `url(${slide_1}` }} >
                    <div class="overlay overlay-a"></div>
                    <div class="intro-content display-table">
                        <div class="table-cell">
                            <div class="container">
                                <div class="row">
                                    <div class="swiper-wrapper">
                                        <div class="intro-body">
                                            <h1 class="intro-title mb-4 ">
                                                <span id="manggom">망그러진 곰<br />비밀의 다락방</span>
                                            </h1>
                                            <p class="intro-subtitle intro-price">
                                                <span class="price-a"><strong>2024년 7월 25일(목) ~ 8월 7일(수)</strong></span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </SwiperSlide>

                <Swiper />
                <SwiperSlide style={{ backgroundImage: `url(${slide_2}` }} >
                    <div class="overlay overlay-a"></div>
                    <div class="intro-content display-table">
                        <div class="table-cell">
                            <div class="container">
                                <div class="row">
                                    <div class="swiper-wrapper">
                                        <div class="intro-body">
                                            <h1 class="intro-title mb-4">
                                                <span id="deadpool"><span class="deadpool-text">데드풀</span> <br /><span class="wolverine-text">울버린</span></span>
                                            </h1>
                                            <p class="intro-subtitle intro-price">
                                                <span class="price-a"><strong>2024년 7월 10일(수) ~ 8월 7일(수)</strong></span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </SwiperSlide>

                <Swiper />
                <SwiperSlide style={{ backgroundImage: `url(${slide_3}` }} >
                    <div class="overlay overlay-a"></div>
                    <div class="intro-content display-table">
                        <div class="table-cell">
                            <div class="container">
                                <div class="row">
                                    <div class="swiper-wrapper">
                                        <div class="intro-body">
                                            <h1 id="itojunji" class="intro-title mb-4">
                                                <span id="itojunji">이토준지 <br />호러하우스</span>
                                            </h1>
                                            <p class="intro-subtitle intro-price">
                                                <span class="price-a"><strong>2024년 6월 15일(토) ~ 9월 8일(일)</strong></span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </SwiperSlide>

                <Swiper />

                <div className="swiper-button-next" style={buttonStyle}></div>
                <div className="swiper-button-prev" style={buttonStyle}></div>
            </Swiper>

            <main id="main">


                <section className="section-property section-t8">

                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="title-wrap d-flex justify-content-between align-items-center">
                                    <div className="title-box">
                                        <h2 className="title-a">인기상품</h2>
                                    </div>
                                    <div className="title-box">
                                        <h2 className="title-a" style={{ cursor: 'pointer', fontWeight: 'normal', fontSize: '18px', textDecoration: 'underline' }}><a href="/goods/goodspopuplist">더보기</a></h2>
                                    </div>
                                </div>
                            </div>
                        </div>




                        {/* 카드들 - 각 카드는 4칸으로 가로 정렬 */}

                        <Swiper
                            spaceBetween={30}       // 카드 간 간격
                            slidesPerView={4}       // 한 번에 보여지는 슬라이드 수
                            modules={[Navigation, Pagination, Autoplay]} // 사용할 모듈 추가
                            navigation={{
                                nextEl: '.swiper-button-next',
                                prevEl: '.swiper-button-prev',
                            }} // 내비게이션 버튼 활성화
                            // pagination={{ clickable: true }} // 페이지네이션
                            autoplay={{ delay: 1500, disableOnInteraction: false }} // 자동 재생 설정
                            loop={true} // 루프 설정
                        >


                            {productList.map((product) => (
                                <>
                                    <Swiper />
                                    <SwiperSlide style={{ backgroundImage: `url(${slide_4}` }} >
                                        <div className="card-box-a card-shadow">
                                            <div className="img-box-a">
                                                <img
                                                    src={require(`../../resources/assets/img/${product.pimg}.jpg`)}
                                                    alt="Property"
                                                    className="img-a img-fluid"
                                                    style={{ width: "100%", height: "300px", objectFit: "cover" }}
                                                />
                                            </div>
                                            <div className="card-overlay">
                                                <div className="card-overlay-a-content">
                                                    <div className="card-header-a">
                                                        <h2 className="product-title">
                                                            <a href={`/goods/goodsdetail/${product.sno}/${product.pno}`}>
                                                                <span className="title-part1">{product.sname}</span><br />
                                                                <span className="title-part2">{product.pname}</span>
                                                            </a>
                                                        </h2>
                                                    </div>
                                                    <div className="card-body-a">
                                                        <div className="price-box d-flex">
                                                            <span className="price-d">{product.pprice}원</span>
                                                        </div>
                                                        <a href={`/goods/goodsdetail/${product.sno}/${product.pno}`} className="link-a">자세히 보기 <span className="bi bi-chevron-right"></span></a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                </>
                            ))}

                        </Swiper>

                    </div>
                </section>

            </main>

        </>

    );
}
export default MainView;