import React, { useEffect, useState, useRef } from 'react'
import {Row, Col, Container} from "react-bootstrap"
import Libreria from "../../media/img/libreria.png"
import Navbar from '../../components/navbar'
import MouseDot from '../../components/mouse_dot'
import AutoScroller from '../../components/auto_scroller'
import NewsListController from '../../controllers/news_list_controller'
import NewsController from "../../controllers/news_controller"
import Ellipse1 from "../../media/img/Ellipse1.png"
import Ellipse2 from "../../media/img/Ellipse2.png"
import Rectangle from "../../media/img/Rectangle.png"
import AboutUs from "../../media/img/about_us.png"
import Rectangle2 from "../../media/img/Rectangle2.png"
import CloseIcon from '@mui/icons-material/Close';
import NewsCard from '../../components/news_card'
import Fade from '@mui/material/Fade';
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import InstagramIcon from '@mui/icons-material/Instagram'
import LocationOnIcon from '@mui/icons-material/LocationOn';
import InfoIcon from '@mui/icons-material/Info';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import PropTypes from 'prop-types';
import { LightenDarkenColor } from '../../utils'

import "./style.css"

function Home(props) {
  // props
  let mobileMode = props.mobileMode

  // states
  const _navbar_balls_number = 7
  const [selectedNews, setSelectedNews] = useState(new NewsController())
  const [newsList, setNewsList] = useState(new NewsListController())
  const [openMenu, setOpenMenu] = useState(false)
  const [section, setSection] = useState(0)

  const homeElement = useRef()
  const last_time_stamp = useRef(0)
  const otherNewsContainer = useRef()
  const observer = useRef(new IntersectionObserver(() => {}))
  
  // constants 
  const sectionColors = [

    {
      "--dark_blue" : "#D3AF45",
      "--medium_blue" : "#2D6980",
      "--light_blue" : LightenDarkenColor("#2D6980", 30)
    },
    {
      "--dark_blue" : "#3E6CA4",
      "--medium_blue" : "#F3AE5F",
      "--light_blue" : LightenDarkenColor("#F3AE5F", 30)
    },
    {
      "--dark_blue" : "#D3AF45",
      "--medium_blue" : "#2D6980",
      "--light_blue" : LightenDarkenColor("#2D6980", 30)
    },
    {
      "--dark_blue" : "#457445",
      "--medium_blue" : "#F3AEE3",
      "--light_blue" : LightenDarkenColor("#F3AEE3", 30)
    },
    {
      "--dark_blue" : "#DAE16E",
      "--medium_blue" : "#50B199",
      "--light_blue" : LightenDarkenColor("#50B199", 30)
    },
    {
      "--dark_blue" : "#1C4786",
      "--medium_blue" : "#CBD2ED",
      "--light_blue" : LightenDarkenColor("#CBD2ED", 30)
    },
    {
      "--dark_blue" : "#3E6CA4",
      "--medium_blue" : "#F3AE5F",
      "--light_blue" : LightenDarkenColor("#F3AE5F", 30)
    },
  ]

  // changes palette on scroll
  function changeColor(sectionNumber) {
    // updating current section
    setSection(sectionNumber)

    // sectionNumber type check
    if(isNaN(sectionNumber)) {
      console.warn("sectionNumber is not a number")
      return
    }

    // css variables are saved in root
    let root = document.querySelector(":root")

    // setting new palette
    for(let variableName of Object.keys(sectionColors[sectionNumber])) {
      let colorHEX = sectionColors[sectionNumber][variableName]
      root.style.setProperty(variableName, colorHEX)

      // change menu background(rgba -> hex format)
      if(variableName == "--dark_blue") root.style.setProperty('--menu_bkg', colorHEX + "CF")
    }
  }

  // used to scroll through sections
  function goTo(e, n) {
    if(e != undefined) e.stopPropagation()
    setOpenMenu(false)
    setSection(n)
  }

  useEffect(() => {
    // newsController setup
    newsList.setState(setNewsList)
    newsList.loadNews()
    
    // stopping scroll propagation on news section
    let newsSection = document.getElementsByClassName('info_news_container')[0]
    newsSection.addEventListener('wheel', (e) => {
      if(newsSection.scrollTop == 0 && e.wheelDeltaY > 0) {
        // scrollPosition = 0, trying to scroll up
        if(e.timeStamp < (last_time_stamp.current + 100)) {
          e.stopPropagation()
        }
      } else if(newsSection.scrollTop + newsSection.clientHeight != newsSection.scrollHeight) {
        // normal scroll
        e.stopPropagation()
      } else if((newsSection.scrollTop + newsSection.clientHeight == newsSection.scrollHeight) && e.wheelDeltaY < 0) {
        // scrollPosition = max scroll length, tryng to scroll down
        if(e.timeStamp < (last_time_stamp.current + 100)) {
          e.stopPropagation()
        }
      } else {
        e.stopPropagation()
      }
      last_time_stamp.current = e.timeStamp
    })
  }, [])

  // setting first selected news on load
  useEffect(() => {
    if(selectedNews.getId() == "") {
      if(newsList.getList()[0] != undefined) {
        // setting default selected news
        setSelectedNews(newsList.getList()[0])
      }
    }

    observer.current.disconnect()
    observer.current = new IntersectionObserver((e) => {
      let element = e[0]
      if(element != undefined) {
        if(element['isIntersecting']) {
          newsList.loadNews()
          console.log('caio')
        }
      }
    }, { root: otherNewsContainer.current })
    // observe the last one element of the list
    let newsElement = [...otherNewsContainer.current.children]
    let lastNewsElement = newsElement[newsElement.length - 1]
    if(lastNewsElement != undefined)
      observer.current.observe(lastNewsElement)
  }, [newsList])
  
  return (
    <div id="home" ref={homeElement}>

      { mobileMode ? "" : <MouseDot />}

      {/* HEADER */}
      <div className="header">
        <Row>
          <Col xs="3">
            {/* <div className="menu bounce clickable">
              <h6 className="m-0 ">Logo</h6>
            </div> */}
          </Col>
          <Col xs="6"></Col>
          <Col xs="3" className="menu_button_container">
            <div onClick={() => setOpenMenu(true)} className={"menu bounce" + (openMenu ? "a open" : "")}>
              {
                openMenu ? 
                <div>
                  <Fade in={openMenu} style={{ transitionDelay: "300ms"}}>
                    <div>
                      <div onClick={(e) => {
                        e.stopPropagation()
                        setOpenMenu(false)
                      }}
                      className="clickable close_menu_container bounce">
                        <CloseIcon className="close_menu_icon"/>
                      </div>
                      <h5 onClick={(e) => goTo(e, 0)} className="main_title white bounce">Home</h5>
                      <h5 onClick={(e) => goTo(e, 1)} className="main_title white bounce">Gli incontri</h5>
                      <h5 onClick={(e) => goTo(e, 2)} className="main_title white bounce">Chi siamo</h5>
                      <h5 onClick={(e) => goTo(e, 4)} className="main_title white bounce">Bambini</h5>
                      <h5 onClick={(e) => goTo(e, 5)} className="main_title white bounce">Le libraie</h5>
                      <h5 onClick={(e) => goTo(e, 6)} className="main_title white bounce">Contattaci</h5>
                    </div>
                  </Fade>
                  
                </div> 
                : <h6 className="m-0 clickable">Menu</h6> 
              }
            </div>
          </Col>
        </Row>
      </div>

      <AutoScroller isActive={!mobileMode} onChange={changeColor} listenerOn={homeElement.current} activeSection={section}>

        {/* MAIN SECTION */}
        <section id="main_section">
          <div className="layout_balls">
            <div className="ball"></div>
            <div className="ball"></div>
            <div className="ball"></div>
            <div className="ball"></div>
          </div>
          <div className="content" >
            <Container className="section">
              <Row>
                <Col md="6" className="centered order-2">
                  <div>
                    <h1 className="main_title">Raggiungibile è un'<span className="intenzione" onClick={() => goTo(undefined, 3)}>intenzione</span> <br/> oltre che <br/>una libreria indipendente.</h1>
                    {/* <Col md={10}>
                      <p className="description">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Facilisis enim at congue est, pellentesque. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    </Col> */}
                    <div className="buttons_container">
                      <button className="bounce clickable" onClick={(e) => goTo(e, 4)}>Bambini</button>
                      <button className="bounce clickable" onClick={(e) => goTo(e, 6)}>Raggiungici</button>
                    </div>
                  </div>
                </Col>
                <Col md="6" className="order-1">
                  <img src={Libreria} className="main_image img-fluid"/>
                </Col>
              </Row>
            </Container>
            {
              !mobileMode ? 
                <Navbar ballsNumber={_navbar_balls_number} ballSelected={1} scrollFunction={goTo}/> :
                ""
            }
          </div>
        </section>

        {/* NEWS SECTION */}
        <section id="news">
          <div className="content">
            <Row>
              <Col md="5" className="wallpaper_container">
                <img src={selectedNews && selectedNews.getWallpaper()} className="wallpaper"/>
              </Col>
              <Col md="6" className="info_news_container">
                <h1 className="sub_title">Le nostre news</h1>
                <h3 className="news_title">{selectedNews && selectedNews.getTitle()}</h3>
                <h6 className="news_date">{selectedNews && selectedNews.getDate()}</h6>
                <p className="news_description">{selectedNews && selectedNews.getDescription()}</p>
                <br />
                <br />
                <h5>Altre news</h5>
                <div className="other_news" ref={otherNewsContainer}>
                  {
                    newsList.getList().map(news => (
                      <div
                      onClick={() => setSelectedNews(news)}
                      key={news.getTitle() + news.getDate()}>
                        <NewsCard isSelected={news == selectedNews} news={news}/>
                      </div>
                    ))
                  }
                </div>
              </Col>
            </Row>
            {
              !mobileMode ? 
                <Navbar ballsNumber={_navbar_balls_number} ballSelected={2} scrollFunction={goTo}/> :
                ""
            }
          </div>
        </section>

        {/* FIRST DESCRIPTION SECTION */}
        <section id="first_description" className="description_section">
          <div className="layout_balls">
            <div className="ball"></div>
            <div className="ball"></div>
            <div className="ball"></div>
            <div className="ball"></div>
          </div>
          <div className="content">
            <Container>
              <Row>
                <Col md="6">
                  <h1 className="main_title">RAGGIUNGIBILE</h1>
                  <h1 className="main_title">É DIETRO</h1>
                  <h1 className="main_title white">L'ANGOLO</h1>
                  <div className="separator"></div>
                  <p className="description">
                    Raggiungibile si trova dietro l'angolo, come tutte le cose fondamentali. <br/>
                    <span style={{ color: "var(--dark_blue)"}}>I libri sono raggiungibili da tutti e ci permettono di arrivare agli altri,</span> <br/>
                    ecco perchè consideriamo Raggiungibile un'intenzione più di una libreria.
                  </p>
                  <img src={Ellipse1} className="img-fluid first_img clickable" />
                </Col>
                <Col md="6">
                  <img src={Ellipse2} className="clickable img-fluid second_img"/>
                </Col>
              </Row>
            </Container>
            {
              !mobileMode ? 
                <Navbar ballsNumber={_navbar_balls_number} ballSelected={3} scrollFunction={goTo}/> :
                ""
            }
          </div>
        </section>

        {/* SECOND DESCRIPTION SECTION */}
        <section id="second_description" className="description_section">
          <div className="layout_balls">
            <div className="ball"></div>
            <div className="ball"></div>
            <div className="ball"></div>
            <div className="ball"></div>
          </div>
          <div className="content">
            <Container>
              <Row>
                <Col md="6">
                  <h1 className="main_title">RACCONTIAMO</h1>
                  <h1 className="main_title">PER</h1>
                  <h1 className="main_title white">RAGGIUNGERCI</h1>
                  <div className="separator"></div>
                  <p className="description">
                  La scala è il mezzo per arrivare in alto, come raccontare è il modo per arrivare in altro.
                  <span style={{ color: "var(--dark_blue)"}}> Le libraie sono la scala</span> e più si sale più la visione si allarga <br/>
                  e vasto diviene il panorama a cui attingere. 
                  </p>
                </Col>
              </Row>
              <Row>
                <Col md="4">
                  <img src={Rectangle} className="img-fluid clickable" />
                </Col>
                <Col md="4">
                  <img src={Rectangle} className="img-fluid" />
                </Col>
                <Col md="4">
                  <img src={Rectangle} className="img-fluid clickable" />
                </Col>
              </Row>
            </Container>
            {
              !mobileMode ? 
                <Navbar ballsNumber={_navbar_balls_number} ballSelected={4} scrollFunction={goTo}/> :
                ""
            }
          </div>
        </section>

        {/* THIRD DESCRIPTION SECTION */}
        <section id="third_description_section" className="description_section">
          <div className="layout_balls">
            <div className="ball"></div>
            <div className="ball"></div>
            <div className="ball"></div>
            <div className="ball"></div>
          </div>
          <div className="content">
            <Container>
              <Col md="10" className="mx-auto">
                <Row>
                  <Col md="3"></Col>
                  <Col md="6" className="title_container">
                    <h1 className="main_title">RAGGIUNGERE</h1>
                    <h1 className="main_title white">I PICCOLI</h1>
                    <div className="separator"></div>
                    <p className="description">
                      La cultura non ha un accesso ma è e deve restare Raggiungibile da chiunque.
                      Per questo raccontiamo storie, libri, autori, e lo facciamo ogni giorno ai grandi e ci concentriamo sui bambini per far raggiungere loro altri... mondi.
                    </p>
                  </Col>
                  <Col md="3"></Col>
                </Row>
                <br/>
                { mobileMode ? "" : <br/> }
                <Row>
                  <Col md="3">
                    <div className="bounce block clickable">
                      <h3>Letture settimanali ad alta voce</h3>
                    </div>
                  </Col>
                  <Col md="3">
                    <div className="bounce block clickable">
                      <h3>Gruppi di lettura per ragazzi</h3>
                    </div>
                  </Col>
                  <Col md="3">
                    <div className="bounce block clickable">
                      <h3>Corsi di approfondimento</h3>
                    </div>
                  </Col>
                  <Col md="3">
                    <div className="bounce block clickable">
                      <h3>...e tutto quello che ci verrà in mente!</h3>
                    </div>
                  </Col>
                </Row>
              </Col>
            </Container>
            {
              !mobileMode ? 
                <Navbar ballsNumber={_navbar_balls_number} ballSelected={5} scrollFunction={goTo}/> :
                ""
            }
          </div>
        </section>

        {/* CONTACT US DESCRIPTION */}
        {/* <section id="contact_us" className="description_section">
          <div className="layout_balls">
            <div className="ball"></div>
            <div className="ball"></div>
            <div className="ball"></div>
            <div className="ball"></div>
          </div>
          <div className="content">
            <Container>
              <Row>
                <Col md="1"></Col>
                <Col md="5" className="title_container">
                  <h1 className="main_title">I</h1>
                  <h1 className="main_title">NOSTRI</h1>
                  <h1 className="main_title white">CONTATTI</h1>
                  <div className="separator"></div>
                  <Col md="10">
                    <p className="description">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make</p>
                  </Col>
                </Col>
                <Col md="5" className="clickable">
                  <div className="contact_card bounce">
                    <Row>
                      <Col className="info_card">
                        <h5 className="card_title">Indirizzo</h5>
                        <p className="card_description m-0">Via amazing, n 12</p>
                        <p className="card_description m-0">San Donà di Piave(VE)</p>
                      </Col>
                      <Col className="card_img_container">
                        <img src={CardImg} className="img_fluid"/>
                      </Col>
                    </Row>
                  </div>
                  <Row>
                    <Col md="6">
                      <div className="contact_card bounce">
                        <div>
                          <h5 className="card_title">Whatsapp</h5>
                          <p className="card_description m-0">+39 340 1234 567</p>
                        </div>
                      </div>
                    </Col>
                    <Col md="6">
                      <div className="contact_card bounce">
                        <div>
                          <h5 className="card_title">Instagram</h5>
                          <p className="card_description m-0">@libreriaraggiungibile</p>
                        </div>
                      </div>
                    </Col>
                  </Row>
                  <div className="contact_card bounce" id="map">
                    <img src={Rectangle2} className="map"/>
                  </div>
                </Col>
              </Row>
            </Container>
            {
              !mobileMode ? 
                <Navbar ballsNumber={_navbar_balls_number} ballSelected={6} scrollFunction={goTo}/> :
                ""
            }
          </div>
        </section> */}

        {/* 
         US */}
        <section id="about_us" className="description_section">
          <div className="layout_balls">
            <div className="ball"></div>
            <div className="ball"></div>
            <div className="ball"></div>
            <div className="ball"></div>
          </div>
          <div className="content">
            <Container>
              <Col md="11" className="mx-auto">
                <h1 className="main_title">SE CI RAGGIUNGI SCOPRIRAI CHE...</h1>
                <div className="separator clickable"></div>
              </Col>
              <br/>
              <Row>
                <Col md="6">
                  <img src={AboutUs} className="img-fluid"/>
                </Col>
                <Col md="5" className="centered clickable">
                  <div className="quote">
                    <FormatQuoteIcon className="quote_icon"/>
                    <h4 className="sub_title">Lideny dice di Azzurra:</h4>
                    <h2 className="description">Perchè quando dice "lo voglio" ce l'avrà.</h2>
                    <br/>
                    <h4 className="sub_title">Azzurra dice di Lideny:</h4>
                    <h2 className="description">E' nata in un paese lontano è per questo che le riesce bene attraversare le distanze tra gli umani.</h2>
                  </div>
                </Col>
              </Row>
            </Container>
            {
              !mobileMode ? 
                <Navbar ballsNumber={_navbar_balls_number} ballSelected={6} scrollFunction={goTo}/> :
                ""
            }
          </div>
        </section>

        {/* CONTACT US DESCRIPTION */}
        <section id="contact_us" className="description_section">
          <div className="layout_balls">
            <div className="ball"></div>
            <div className="ball"></div>
            <div className="ball" style={{ display: "none" }}></div>
            <div className="ball"></div>
          </div>
          <div className="content">
            <Container>
              <Row>
                <Col md="1"></Col>
                <Col md="5" className="clickable">
                  <h1 className="main_title">I</h1>
                  <h1 className="main_title">NOSTRI</h1>
                  <h1 className="main_title white">CONTATTI</h1>
                  <div className="separator"></div>
                  <br/>
                  <Row>
                    <Col md>
                      <h5 className="sub_title"><WhatsAppIcon/> Whatsapp</h5>
                      <p className="description">+39 379 188 8263</p>
                    </Col>
                    <Col md>
                      <h5 className="sub_title"><InstagramIcon/> Instagram</h5>
                      <p className="description"><a target="blank" href="https://www.instagram.com/raggiungibile/">@raggiungibile</a></p>
                    </Col>
                  </Row>
                  <Row>
                    <Col md>
                      <h5 className="sub_title"><LocationOnIcon/> Indirizzo</h5>
                      <p className="description m-0">Vicolo Nuovo, 4</p>
                      <p className="description">San Donà di Piave(VE)</p>
                    </Col>
                    <Col md>
                      <h5 className="sub_title"><InfoIcon/> Informazioni</h5>
                      <p className="description m-0">P.Iva 04687070278</p>
                      <p className="description">SdI SU9YNJA</p>
                    </Col>
                  </Row>
                </Col>
                <Col md="5" className="clickable">
                  <div className="contact_card bounce" id="map">
                    <img src={Rectangle2} className="map"/>
                  </div>
                </Col>
                <Col md="1"></Col>
              </Row>
            </Container>
            {
              !mobileMode ? 
                <Navbar ballsNumber={_navbar_balls_number} ballSelected={7} scrollFunction={goTo}/> :
                ""
            }
          </div>
        </section>
      </AutoScroller>
    </div>
  )
}

Home.propTypes = {
  mobileMode: PropTypes.bool.isRequired
}

export default Home