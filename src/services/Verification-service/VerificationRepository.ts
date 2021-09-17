import { IVerificationRepository } from './IVerificationRepository'
import { maliciousLinkController } from '@database'
import { compareTwoStrings } from 'string-similarity'
import { Response } from '@dtos'
import { URL } from 'url'


export class VerificationRepository implements IVerificationRepository {
  async find_malicious_links(words:string[]): Promise<Response.Verification> {
    const result = {messages:[{text:'<b>PERSON</b>, não mande links maliciosos...'}], malicious:false}

    const urls = this.get_urls_from_message(words).map(url => {
      const parts = url.split('.')
      return parts[0] === 'www' ? parts[1] : parts[0]
    })

    const maliciousUrls = await maliciousLinkController.find_all()
      .then(links => { 
        if (links) return links.map(uri => { return new URL(String(uri.link_url)).hostname })
      })
    
    if (maliciousUrls != null)
      urls.forEach(url => maliciousUrls.forEach(link => {
        if (compareTwoStrings(url, link) < 0.8) return
        result.malicious = true, urls.length = maliciousUrls.length = 0
      }))

    return result
  }
  
  get_urls_from_message(words:string[]): string[] {
    const urls:string[] = []
    const isURLRegex = 
      /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/
    
    

    words.forEach(word => { 
      const irURL = isURLRegex.test(word)
      try {

        urls.push(new URL(word).hostname)
      } catch (err) {null}
    })
    return urls
  }
}