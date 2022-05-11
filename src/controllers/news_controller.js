import News from "../models/news";
import ApiNewsController from "./server/news_controller_api";

class NewsController extends News {
  constructor() {
    super()
    this.state = undefined
    this.overrideState = undefined
  }

  // state settiings
  setState(state) {
    this.state = state
  }

  setOverrideState(overrideState) {
    this.overrideState = overrideState 
  }

  updateInfo() {
    if(this.state != undefined) {
      let newIntstance = new NewsController()
      Object.assign(newIntstance, this)
      this.state(newIntstance)
    }
    else if(this.overrideState != undefined) this.overrideState()
  }

  // getter
  getId() { return this.id }
  getWallpaper() { return this.wallpaper }
  getTitle() { return this.title }
  getDescription() { return this.description }
  getDate() { return this.date }

  // setter 
  setId(id, auto_save = true) {
    // cheking wallpaper type
    if(typeof id != "string") console.warn("id is not a string: ", id, typeof id)
    this.id = id
    if(auto_save) this.updateInfo()
  }

  setWallpaper(wallpaper, auto_save = true) {
    // cheking wallpaper type
    if(typeof wallpaper != "string") console.warn("Wallpaper is not a string: ", wallpaper, typeof wallpaper)
    this.wallpaper = wallpaper
    if(auto_save) this.updateInfo()
  }

  setTitle(title, auto_save = true) {
    // cheking title type
    if(typeof title != "string") console.warn("title is not a string: ", title, typeof title)
    this.title = title
    if(auto_save) this.updateInfo()
  }

  setDescription(description, auto_save = true) {
    // cheking description type
    if(typeof description != "string") console.warn("description is not a string: ", description, typeof description)
    this.description = description
    if(auto_save) this.updateInfo()
  }

  setDate(date, auto_save = true) {
    // cheking date type
    if(typeof date != "string") console.warn("date is not a string: ", date, typeof date)
    this.date = date
    if(auto_save) this.updateInfo()
  }
}

export default NewsController