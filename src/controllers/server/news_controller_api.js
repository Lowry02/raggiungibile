import Database from "."

class ApiNewsController extends Database {
  constructor() {
    super()
    this.page = 1
    this.pageCount = undefined
  }

  isListOver() {
    return (this.page > this.pageCount && this.page != undefined)
  }

  async getAllNews() {
    let async = true
    if(!this.isListOver()) {
      return this.get(async, {
        url: "/api/allnews?pagination[page]=" + this.page,
        success: (data) => {
          this.page++
          this.pageCount = data['meta']['pagination']['pageCount']
        }
      })
    }
  }
}

export default ApiNewsController