import React from 'react'
import PropTypes from "prop-types"
import NewsController from "../../controllers/news_controller"
import "./style.css"

function NewsCard(props) {
  let isSelected = props.isSelected
  let news = props.news

  return (
    <div className={"news_card clickable bounce" + (isSelected ? " selected" : "")}>
      <img src={news.getWallpaper()} className="news_card_wallpaper"/>
      <div className="black_layer"></div>
      <h4 className="news_card_title">{news.getTitle()}</h4>
    </div>
  )
}

NewsCard.propTypes = {
  isSelected: PropTypes.bool.isRequired,
  news: PropTypes.instanceOf(NewsController),
}

export default NewsCard