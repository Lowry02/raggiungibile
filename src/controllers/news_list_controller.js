import NewsController from "./news_controller"
import Foto1 from "../media/img/foto1.jpeg"
import Foto2 from "../media/img/foto2.webp"
import Foto3 from "../media/img/foto3.webp"
import ApiNewsController from "./server/news_controller_api"
import { ThreeSixty } from "@mui/icons-material"

class NewsListController {
  constructor() {
    this.list = []
    this.state = undefined
    this.overrideState = undefined
    this.api = new ApiNewsController()
  }

  // state settings 
  setState(state) {
    this.state = state
  }

  setOverrideState(overrideState) {
    this.overrideState = overrideState 
  }

  updateInfo() {
    if(this.state != undefined) {
      let newIntstance = new NewsListController()
      Object.assign(newIntstance, this)
      this.state(newIntstance)
    }
    else if(this.overrideState != undefined) this.overrideState()
  }

  // getter
  getList() { return this.list }

  // setter 
  setList(list, auto_save = true) {
    // cheking list type
    if(!Array.isArray(list)) console.warn("list is not a list: ", list, typeof list)
    this.list = list
    if(auto_save) this.updateInfo()
  }

  // loading info from server
  async loadNews() {
    return this.api.getAllNews()
    .then((data) => {
      // updating internal state
      if(data != undefined) {
        let news = data['data']
  
        if(news != undefined) {
          for(let item of Object.values(news)) {
            let id = item['id']
            item = item['attributes']
            let wallpaper = item['wallpaper']
            let title = item['title']
            let description = item['description']
            let date = item['date']
            let newNews = new NewsController()
            newNews.setId(id)
            newNews.setWallpaper(wallpaper)
            newNews.setTitle(title)
            newNews.setDescription(description)
            newNews.setDate(date)
            this.list.push(newNews)
          }
  
          this.updateInfo()
        } else console.warn("News not found inside response")
      }
    })
    .catch((message) => console.warn(message))
  }
}

export default NewsListController