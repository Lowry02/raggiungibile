import $ from "jquery"

class Database {
  constructor() {
    this.base_url = "http://localhost:1337"
  }

  async request(type, async, fields) {
    // checking parameters type
    if(typeof type != "string") {
      console.warn("Type is not a string")
      throw TypeError("Type is not a string")
    }

    if(typeof async != "boolean") {
      console.warn("Async is not a boolean")
      throw TypeError("Async is not a boolean")
    }

    if(!async) {
      let info
      let error = {error: false, message: "Operation completed successfully"}

      try {
        await $.ajax({
          type: type,
          contentType: "application/json",
          success: (data) => info = data,
          error: (message) => error = {error: true, message: message},
          ...fields,
          url: this.base_url + fields['url']
        })

        return {error: false, info: info}
      } catch {
        return error
      }
    } else {
      return $.ajax({
        type: type,
        contentType: "application/json",
        ...fields,
        url: this.base_url + fields['url']
      })
    }
  }

  async get(async, fields) {
    // checking parameters type
    if(typeof async != "boolean") {
      console.warn("Async is not a boolean")
      throw TypeError("Async is not a boolean")
    }
    
    if(async) return this.request("GET", async, fields)
    else {
      let info = await this.request("GET", async, fields)
      return info
    }
  }

  async post(async, fields) {
    // checking parameters type
    if(typeof async != "boolean") {
      console.warn("Async is not a boolean")
      throw TypeError("Async is not a boolean")
    }
    
    if(async) this.request("POST", async,  fields)
    else {
      let info = await this.request("POST", async, fields)
      return info
    }
  }


  async delete(async, fields) {
    // checking parameters type
    if(typeof async != "boolean") {
      console.warn("Async is not a boolean")
      throw TypeError("Async is not a boolean")
    }
    
    if(async) return this.request("DELETE", async, fields)
    else {
      let info = await this.request("DELETE", async, fields)
      return info
    }
  }
}

export default Database